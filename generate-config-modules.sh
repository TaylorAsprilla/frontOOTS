#!/bin/bash

# Script para generar módulos de configuración automáticamente
# Uso: ./generate-config-modules.sh

# Definir los módulos a crear con sus propiedades
# Formato: "folder-name|SingularName|PluralName|icon|spanish-singular|spanish-plural|api-endpoint"
declare -a modules=(
  "health-insurance|HealthInsurance|HealthInsurances|hospital|EPS|EPS|health-insurance"
  "family-relationship|FamilyRelationship|FamilyRelationships|account-group|Parentesco|Parentescos|family-relationship"
  "academic-level|AcademicLevel|AcademicLevels|school|Nivel Académico|Niveles Académicos|academic-level"
  "income-source|IncomeSource|IncomeSources|cash-multiple|Fuente de Ingresos|Fuentes de Ingresos|income-source"
  "income-level|IncomeLevel|IncomeLevels|chart-line|Nivel de Ingresos|Niveles de Ingresos|income-level"
  "housing-type|HousingType|HousingTypes|home|Tipo de Vivienda|Tipos de Vivienda|housing-type"
)

BASE_PATH="src/app/pages/configuration"

for module_info in "${modules[@]}"; do
  IFS='|' read -r folder singular plural icon spanish_singular spanish_plural api_endpoint <<< "$module_info"
  
  MODULE_PATH="$BASE_PATH/$folder"
  mkdir -p "$MODULE_PATH/$folder-list"
  mkdir -p "$MODULE_PATH/$folder-form"
  
  echo "Creando módulo: $folder"
  echo "Singular: $singular, Plural: $plural"
  echo "Español: $spanish_singular / $spanish_plural"
  echo "---"
done

echo "Script completado. Ahora crea los archivos manualmente o usa otro método."
