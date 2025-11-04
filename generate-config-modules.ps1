#!/usr/bin/env pwsh
# Script para generar módulos de configuración basados en plantilla maritalStatus

param(
    [Parameter(Mandatory=$false)]
    [string]$ModuleName
)

# Definición de módulos a crear
$modules = @(
    @{
        kebabCase = "health-insurance"
        pascalCase = "HealthInsurance"
        camelCase = "healthInsurance"
        singular = "EPS"
        plural = "EPS"
        singularEn = "Health Insurance"
        pluralEn = "Health Insurances"
        icon = "heart"
        endpoint = "health-insurance"
    },
    @{
        kebabCase = "family-relationship"
        pascalCase = "FamilyRelationship"
        camelCase = "familyRelationship"
        singular = "Parentesco"
        plural = "Parentescos"
        singularEn = "Family Relationship"
        pluralEn = "Family Relationships"
        icon = "users"
        endpoint = "family-relationship"
    },
    @{
        kebabCase = "income-source"
        pascalCase = "IncomeSource"
        camelCase = "incomeSource"
        singular = "Fuente de Ingresos"
        plural = "Fuentes de Ingresos"
        singularEn = "Income Source"
        pluralEn = "Income Sources"
        icon = "dollar-sign"
        endpoint = "income-source"
    },
    @{
        kebabCase = "income-level"
        pascalCase = "IncomeLevel"
        camelCase = "incomeLevel"
        singular = "Nivel de Ingresos"
        plural = "Niveles de Ingresos"
        singularEn = "Income Level"
        pluralEn = "Income Levels"
        icon = "trending-up"
        endpoint = "income-level"
    },
    @{
        kebabCase = "housing-type"
        pascalCase = "HousingType"
        camelCase = "housingType"
        singular = "Tipo de Vivienda"
        plural = "Tipos de Vivienda"
        singularEn = "Housing Type"
        pluralEn = "Housing Types"
        icon = "home"
        endpoint = "housing-type"
    }
)

# Directorio base
$baseDir = "src/app/pages/configuration"
$templateDir = "$baseDir/marital-status"

# Función para crear un módulo
function New-ConfigModule {
    param($module)
    
    $targetDir = "$baseDir/$($module.kebabCase)"
    
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "Creando módulo: $($module.pascalCase)" -ForegroundColor Yellow
    Write-Host "================================" -ForegroundColor Cyan
    
    # Verificar que existe el template
    if (-not (Test-Path $templateDir)) {
        Write-Error "No se encuentra el directorio template: $templateDir"
        return
    }
    
    # Crear estructura de directorios
    Write-Host "✓ Creando directorios..." -ForegroundColor Green
    New-Item -ItemType Directory -Path "$targetDir/$($module.kebabCase)-list" -Force | Out-Null
    New-Item -ItemType Directory -Path "$targetDir/$($module.kebabCase)-form" -Force | Out-Null
    
    # Copiar y transformar archivos
    $files = @(
        @{ src = "marital-status.interface.ts"; dest = "$($module.kebabCase).interface.ts" },
        @{ src = "marital-status.service.ts"; dest = "$($module.kebabCase).service.ts" },
        @{ src = "marital-status.routes.ts"; dest = "$($module.kebabCase).routes.ts" },
        @{ src = "marital-status-list/marital-status-list.component.ts"; dest = "$($module.kebabCase)-list/$($module.kebabCase)-list.component.ts" },
        @{ src = "marital-status-list/marital-status-list.component.html"; dest = "$($module.kebabCase)-list/$($module.kebabCase)-list.component.html" },
        @{ src = "marital-status-list/marital-status-list.component.scss"; dest = "$($module.kebabCase)-list/$($module.kebabCase)-list.component.scss" },
        @{ src = "marital-status-form/marital-status-form.component.ts"; dest = "$($module.kebabCase)-form/$($module.kebabCase)-form.component.ts" },
        @{ src = "marital-status-form/marital-status-form.component.html"; dest = "$($module.kebabCase)-form/$($module.kebabCase)-form.component.html" },
        @{ src = "marital-status-form/marital-status-form.component.scss"; dest = "$($module.kebabCase)-form/$($module.kebabCase)-form.component.scss" }
    )
    
    foreach ($file in $files) {
        $srcPath = "$templateDir/$($file.src)"
        $destPath = "$targetDir/$($file.dest)"
        
        if (-not (Test-Path $srcPath)) {
            Write-Warning "No se encuentra archivo: $srcPath"
            continue
        }
        
        Write-Host "  → Creando: $($file.dest)" -ForegroundColor Gray
        
        # Leer contenido
        $content = Get-Content $srcPath -Raw -Encoding UTF8
        
        # Reemplazos de nombres
        $content = $content -replace "marital-status", $module.kebabCase
        $content = $content -replace "MaritalStatus", $module.pascalCase
        $content = $content -replace "maritalStatus", $module.camelCase
        $content = $content -replace "MARITAL_STATUS", ($module.kebabCase.ToUpper() -replace "-", "_")
        
        # Reemplazos de endpoint API
        $content = $content -replace "/marital-status", "/$($module.endpoint)"
        
        # Guardar archivo
        Set-Content -Path $destPath -Value $content -Encoding UTF8 -NoNewline
    }
    
    Write-Host "✓ Módulo $($module.pascalCase) creado exitosamente" -ForegroundColor Green
    Write-Host ""
}

# Ejecutar
if ($ModuleName) {
    # Crear un módulo específico
    $module = $modules | Where-Object { $_.kebabCase -eq $ModuleName }
    if ($module) {
        New-ConfigModule $module
    } else {
        Write-Error "Módulo no encontrado: $ModuleName"
        Write-Host "Módulos disponibles:"
        $modules | ForEach-Object { Write-Host "  - $($_.kebabCase)" }
    }
} else {
    # Crear todos los módulos
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "GENERANDO TODOS LOS MÓDULOS" -ForegroundColor Yellow
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host ""
    
    foreach ($module in $modules) {
        New-ConfigModule $module
    }
    
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "RESUMEN" -ForegroundColor Yellow
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "Total de módulos creados: $($modules.Count)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximos pasos:" -ForegroundColor Yellow
    Write-Host "1. Revisar archivos generados" -ForegroundColor White
    Write-Host "2. Verificar compilación: ng build" -ForegroundColor White
    Write-Host "3. Actualizar traducciones en en.json (ya están en es.json)" -ForegroundColor White
    Write-Host "4. Probar en navegador: ng serve" -ForegroundColor White
}
