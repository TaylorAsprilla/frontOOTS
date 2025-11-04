#!/bin/bash
# Script para crear módulos de configuración
# Uso: ./create-module.sh <module-name> <PascalCase> <CamelCase> <"Nombre ES"> <"Nombre Plural ES">

MODULE_KEBAB=$1    # health-insurance
MODULE_PASCAL=$2   # HealthInsurance  
MODULE_CAMEL=$3    # healthInsurance
NAME_ES=$4         # EPS
NAME_PLURAL_ES=$5  # EPS

BASE_DIR="src/app/pages/configuration"
TEMPLATE_DIR="$BASE_DIR/marital-status"
TARGET_DIR="$BASE_DIR/$MODULE_KEBAB"

echo "Creando módulo: $MODULE_PASCAL"
echo "========================================"

# Crear directorios
mkdir -p "$TARGET_DIR/$MODULE_KEBAB-list"
mkdir -p "$TARGET_DIR/$MODULE_KEBAB-form"

# Función para reemplazar contenido
replace_content() {
    sed "s/marital-status/$MODULE_KEBAB/g" | \
    sed "s/MaritalStatus/$MODULE_PASCAL/g" | \
    sed "s/maritalStatus/$MODULE_CAMEL/g" | \
    sed "s/MARITAL_STATUS/${MODULE_KEBAB^^}/g" | \
    sed "s/Estado Civil/$NAME_ES/g" | \
    sed "s/Estados Civiles/$NAME_PLURAL_ES/g" | \
    sed "s/estado civil/$NAME_ES/g" | \
    sed "s/estados civiles/${NAME_PLURAL_ES,,}/g" | \
    sed "s/mdi-ring/mdi-hospital/g"
}

# Copiar y transformar archivos
echo "  - Creando interface..."
cat "$TEMPLATE_DIR/marital-status.interface.ts" | replace_content > "$TARGET_DIR/$MODULE_KEBAB.interface.ts"

echo "  - Creando service..."
cat "$TEMPLATE_DIR/marital-status.service.ts" | replace_content > "$TARGET_DIR/$MODULE_KEBAB.service.ts"

echo "  - Creando routes..."
cat "$TEMPLATE_DIR/marital-status.routes.ts" | replace_content > "$TARGET_DIR/$MODULE_KEBAB.routes.ts"

echo "  - Creando list component..."
cat "$TEMPLATE_DIR/marital-status-list/marital-status-list.component.ts" | replace_content > "$TARGET_DIR/$MODULE_KEBAB-list/$MODULE_KEBAB-list.component.ts"
cat "$TEMPLATE_DIR/marital-status-list/marital-status-list.component.html" | replace_content > "$TARGET_DIR/$MODULE_KEBAB-list/$MODULE_KEBAB-list.component.html"
cat "$TEMPLATE_DIR/marital-status-list/marital-status-list.component.scss" | replace_content > "$TARGET_DIR/$MODULE_KEBAB-list/$MODULE_KEBAB-list.component.scss"

echo "  - Creando form component..."
cat "$TEMPLATE_DIR/marital-status-form/marital-status-form.component.ts" | replace_content > "$TARGET_DIR/$MODULE_KEBAB-form/$MODULE_KEBAB-form.component.ts"
cat "$TEMPLATE_DIR/marital-status-form/marital-status-form.component.html" | replace_content > "$TARGET_DIR/$MODULE_KEBAB-form/$MODULE_KEBAB-form.component.html"
cat "$TEMPLATE_DIR/marital-status-form/marital-status-form.component.scss" | replace_content > "$TARGET_DIR/$MODULE_KEBAB-form/$MODULE_KEBAB-form.component.scss"

echo "✓ Módulo $MODULE_PASCAL creado exitosamente"
echo ""
