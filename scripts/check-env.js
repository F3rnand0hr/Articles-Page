#!/usr/bin/env node

/**
 * Script para verificar la configuración de NEXT_PUBLIC_SITE_URL
 * Ejecuta: node scripts/check-env.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de NEXT_PUBLIC_SITE_URL...\n');

// Verificar si existe .env.local
const envLocalPath = path.join(process.cwd(), '.env.local');
const envPath = path.join(process.cwd(), '.env');

let envContent = '';

if (fs.existsSync(envLocalPath)) {
  console.log('✅ Archivo .env.local encontrado');
  envContent = fs.readFileSync(envLocalPath, 'utf8');
} else if (fs.existsSync(envPath)) {
  console.log('⚠️  Archivo .env encontrado (deberías usar .env.local)');
  envContent = fs.readFileSync(envPath, 'utf8');
} else {
  console.log('❌ No se encontró archivo .env.local');
  console.log('\n📝 Crea un archivo .env.local en la raíz del proyecto con:');
  console.log('   NEXT_PUBLIC_SITE_URL=http://TU_IP_LOCAL:3000');
  process.exit(1);
}

// Buscar NEXT_PUBLIC_SITE_URL
const siteUrlMatch = envContent.match(/NEXT_PUBLIC_SITE_URL\s*=\s*(.+)/);

if (siteUrlMatch) {
  const siteUrl = siteUrlMatch[1].trim();
  console.log(`✅ NEXT_PUBLIC_SITE_URL encontrado: ${siteUrl}`);
  
  // Verificar formato
  if (siteUrl.includes('localhost')) {
    console.log('⚠️  ADVERTENCIA: localhost no funcionará desde dispositivos móviles');
    console.log('   Usa tu IP local en su lugar (ej: http://192.168.1.100:3000)');
  } else if (siteUrl.match(/^https?:\/\/\d+\.\d+\.\d+\.\d+:\d+$/)) {
    console.log('✅ Formato de URL parece correcto');
  } else {
    console.log('⚠️  Verifica que la URL tenga el formato correcto:');
    console.log('   http://IP:PUERTO o https://dominio.com');
  }
  
  // Verificar si tiene espacios o comillas
  if (siteUrl.includes(' ') || siteUrl.startsWith('"') || siteUrl.startsWith("'")) {
    console.log('❌ ERROR: La URL no debe tener espacios ni comillas');
    console.log('   Formato correcto: NEXT_PUBLIC_SITE_URL=http://192.168.1.100:3000');
  }
} else {
  console.log('❌ NEXT_PUBLIC_SITE_URL no encontrado en el archivo');
  console.log('\n📝 Agrega esta línea a tu archivo .env.local:');
  console.log('   NEXT_PUBLIC_SITE_URL=http://TU_IP_LOCAL:3000');
  process.exit(1);
}

console.log('\n📋 Próximos pasos:');
console.log('1. Verifica que la IP en NEXT_PUBLIC_SITE_URL es correcta');
console.log('2. Reinicia el servidor de desarrollo (Ctrl+C y luego npm run dev)');
console.log('3. Crea una NUEVA cuenta para recibir un email con el enlace correcto');
console.log('4. Verifica en la consola del navegador que se muestra la URL correcta');

