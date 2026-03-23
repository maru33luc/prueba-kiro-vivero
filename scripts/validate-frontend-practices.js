#!/usr/bin/env node

/**
 * Frontend Best Practices Validator
 * Valida que el código Angular cumpla con las mejores prácticas definidas en FRONTEND_BEST_PRACTICES.md
 *
 * Uso: npm run validate:frontend-practices
 */

const fs = require('fs');
const path = require('path');

const FRONTEND_DIR = './frontend/src/app';
const ISSUES = [];
const WARNINGS = [];
const SUCCESSES = [];

interface ValidationIssue {
  file: string;
  line?: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  code: string;
}

// ============================================================================
// VALIDADORES
// ============================================================================

function validateComponentChangeDetection(filePath: string, content: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Buscar componentes que no usen OnPush
  if (content.includes('@Component') && !content.includes('changeDetection')) {
    // Excepciones: smart components (pages)
    if (!filePath.includes('/pages/')) {
      const match = content.match(/@Component\(/);
      if (match) {
        issues.push({
          file: filePath,
          message: 'Componente presentacional sin ChangeDetectionStrategy.OnPush',
          severity: 'warning',
          code: 'PERF001'
        });
      }
    }
  }

  return issues;
}

function validateMemoryLeaks(filePath: string, content: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Buscar suscripciones sin unsubscribe
  if (content.includes('.subscribe(') &&
      !content.includes('takeUntil') &&
      filePath.endsWith('.component.ts')) {

    issues.push({
      file: filePath,
      message: 'Posible memory leak: suscripción sin takeUntil o async pipe',
      severity: 'error',
      code: 'MEMORY001'
    });
  }

  return issues;
}

function validateOnDestroy(filePath: string, content: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Si tiene takeUntil, debe tener ngOnDestroy
  if (content.includes('takeUntil(') && !content.includes('ngOnDestroy')) {
    issues.push({
      file: filePath,
      message: 'takeUntil usado pero ngOnDestroy no implementado',
      severity: 'warning',
      code: 'LIFECYCLE001'
    });
  }

  return issues;
}

function validateConsoleLog(filePath: string, content: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (line.includes('console.log') ||
        line.includes('console.error') ||
        line.includes('console.warn')) {
      issues.push({
        file: filePath,
        line: index + 1,
        message: 'Eliminar console.log en producción',
        severity: 'warning',
        code: 'DEBUG001'
      });
    }
  });

  return issues;
}

function validateNamingConventions(filePath: string, content: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Validar que los selectores usen kebab-case
  const selectorMatch = content.match(/selector:\s*['"`]([^'"`]+)['"``]/);
  if (selectorMatch) {
    const selector = selectorMatch[1];
    if (!selector.startsWith('app-') && !selector.startsWith('app-shared-')) {
      issues.push({
        file: filePath,
        message: `Selector debe empezar con 'app-' prefix: ${selector}`,
        severity: 'warning',
        code: 'NAMING001'
      });
    }
    if (/[A-Z]/.test(selector)) {
      issues.push({
        file: filePath,
        message: `Selector debe usar kebab-case: ${selector}`,
        severity: 'warning',
        code: 'NAMING002'
      });
    }
  }

  return issues;
}

function validateTemplateLogic(filePath: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!filePath.endsWith('.html')) {
    return issues;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Buscar lógica compleja en templates
    if (content.match(/\{\{.*\?.*:.*\}\}/g)) {
      issues.push({
        file: filePath,
        message: 'Lógica ternaria en template - mover a componente',
        severity: 'warning',
        code: 'TEMPLATE001'
      });
    }

    // Buscar múltiples operadores en bindings
    if (content.match(/\{\{.*[\+\-\*\/].*\}\}/g)) {
      issues.push({
        file: filePath,
        message: 'Operadores matemáticos en template - mover a componente',
        severity: 'warning',
        code: 'TEMPLATE002'
      });
    }

    // Buscar método calls en template
    if (content.match(/\{\{.*\([^)]*\).*\}\}/g) && !content.includes('| async')) {
      issues.push({
        file: filePath,
        message: 'Llamadas a métodos en template pueden degradar performance',
        severity: 'warning',
        code: 'TEMPLATE003'
      });
    }
  } catch (e) {
    // ignore
  }

  return issues;
}

function validateAsyncPipe(filePath: string, content: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!filePath.endsWith('.component.html')) {
    return issues;
  }

  try {
    const htmlContent = fs.readFileSync(filePath, 'utf-8');

    // Buscar observables que no usen async pipe
    if (content.includes('Observable<') && !htmlContent.includes('| async')) {
      issues.push({
        file: filePath,
        message: 'Posible observable sin async pipe en template corresoniente',
        severity: 'info',
        code: 'RxJS001'
      });
    }
  } catch (e) {
    // ignore
  }

  return issues;
}

function validateTestCoverage(filePath: string, content: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Archivos principales deben tener tests
  if ((filePath.includes('/services/') || filePath.includes('/guards/')) &&
      filePath.endsWith('.ts') &&
      !filePath.endsWith('.spec.ts')) {

    const specFile = filePath.replace('.ts', '.spec.ts');
    if (!fs.existsSync(specFile)) {
      issues.push({
        file: filePath,
        message: 'Archivo sin test: ' + specFile,
        severity: 'warning',
        code: 'TEST001'
      });
    }
  }

  return issues;
}

function validateSecurity(filePath: string, content: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Buscar uso de localStorage para tokens
  if (content.includes('localStorage') && filePath.includes('auth')) {
    issues.push({
      file: filePath,
      message: 'Considera usar sessionStorage en lugar de localStorage para tokens sensibles',
      severity: 'warning',
      code: 'SECURITY001'
    });
  }

  // Buscar bypassSecurityTrustHtml sin sanitización
  if (content.includes('bypassSecurityTrust')) {
    issues.push({
      file: filePath,
      message: 'Asegúrate de validar el contenido antes de usar bypassSecurityTrust*',
      severity: 'warning',
      code: 'SECURITY002'
    });
  }

  return issues;
}

// ============================================================================
// UTILIDADES
// ============================================================================

function walkDir(dir: string, callback: (file: string) => void) {
  try {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);

      // Skip node_modules y archivos de configuración
      if (file.startsWith('.') ||
          file === 'node_modules' ||
          file.includes('node_modules')) {
        return;
      }

      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath, callback);
      } else if (file.endsWith('.ts') || file.endsWith('.html')) {
        callback(filePath);
      }
    });
  } catch (e) {
    console.error(`Error reading directory ${dir}:`, e);
  }
}

function runValidations() {
  console.log('\n📋 Validando mejores prácticas de Angular...\n');

  if (!fs.existsSync(FRONTEND_DIR)) {
    console.error(`❌ Directorio no encontrado: ${FRONTEND_DIR}`);
    process.exit(1);
  }

  let filesChecked = 0;

  walkDir(FRONTEND_DIR, (file) => {
    filesChecked++;
    const relativePath = path.relative('.', file);

    try {
      const content = fs.readFileSync(file, 'utf-8');

      // Ejecutar todos los validadores
      if (file.endsWith('.ts')) {
        ISSUES.push(...validateComponentChangeDetection(relativePath, content));
        ISSUES.push(...validateMemoryLeaks(relativePath, content));
        ISSUES.push(...validateOnDestroy(relativePath, content));
        ISSUES.push(...validateConsoleLog(relativePath, content));
        ISSUES.push(...validateNamingConventions(relativePath, content));
        ISSUES.push(...validateAsyncPipe(relativePath, content));
        ISSUES.push(...validateTestCoverage(relativePath, content));
        ISSUES.push(...validateSecurity(relativePath, content));
      } else if (file.endsWith('.html')) {
        ISSUES.push(...validateTemplateLogic(file));
      }
    } catch (e) {
      console.error(`Error validando ${relativePath}:`, e);
    }
  });

  // Mostrar resultados
  console.log(`✅ Archivos analizados: ${filesChecked}\n`);

  if (ISSUES.length === 0) {
    console.log('🎉 ¡Excelente! No se encontraron problemas.\n');
    return;
  }

  // Agrupar por severidad
  const errors = ISSUES.filter(i => i.severity === 'error');
  const warnings = ISSUES.filter(i => i.severity === 'warning');
  const infos = ISSUES.filter(i => i.severity === 'info');

  if (errors.length > 0) {
    console.log(`❌ ERRORES (${errors.length}):\n`);
    errors.forEach(issue => {
      console.log(`  [${issue.code}] ${issue.file}${issue.line ? ':' + issue.line : ''}`);
      console.log(`  └─ ${issue.message}\n`);
    });
  }

  if (warnings.length > 0) {
    console.log(`⚠️  ADVERTENCIAS (${warnings.length}):\n`);
    warnings.forEach(issue => {
      console.log(`  [${issue.code}] ${issue.file}${issue.line ? ':' + issue.line : ''}`);
      console.log(`  └─ ${issue.message}\n`);
    });
  }

  if (infos.length > 0) {
    console.log(`ℹ️  INFORMACIÓN (${infos.length}):\n`);
    infos.forEach(issue => {
      console.log(`  [${issue.code}] ${issue.file}`);
      console.log(`  └─ ${issue.message}\n`);
    });
  }

  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Total de problemas encontrados: ${ISSUES.length}`);
  console.log(`Errores: ${errors.length} | Advertencias: ${warnings.length} | Info: ${infos.length}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  // Exit con código de error si hay problemas críticos
  if (errors.length > 0) {
    process.exit(1);
  }
}

// ============================================================================
// EJECUTAR
// ============================================================================

runValidations();
