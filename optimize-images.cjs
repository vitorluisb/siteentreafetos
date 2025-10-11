// Script para otimizar imagens automaticamente
const fs = require('fs');
const path = require('path');

// Configuração de otimização
const OPTIMIZATION_CONFIG = {
  // Imagens essenciais que devem ser mantidas (mas otimizadas)
  keepImages: [
    'public/logo/entreafetoslogo.png',
    'public/equipe/membro.png',
    'public/equipe/membro1.png', 
    'public/equipe/membro2.png',
    'public/publicacoes/*.png',
    'public/bannerhero/*.png'
  ],
  
  // Imagens que podem ser removidas (muito pesadas)
  removeImages: [
    'public/cliniarco/salaated.png',
    'public/cliniarco/sala3.png',
    'public/cliniarco/fachadalogo.png',
    'public/cliniarco/aparelhos4.png',
    'public/cliniarco/rall.png',
    'public/cliniaquarela/escalada.png',
    'public/cliniarco/arcond.png',
    'public/cliniarco/equipamentos.png'
  ]
};

console.log('🎯 Iniciando otimização de imagens...');

// Função para verificar tamanho de arquivo
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return (stats.size / (1024 * 1024)).toFixed(2); // MB
  } catch (error) {
    return 0;
  }
}

// Listar imagens pesadas
function listHeavyImages() {
  console.log('\n📊 Imagens pesadas encontradas:');
  
  const heavyImages = [
    'public/videocompr.mp4',
    'public/cliniarco/salaated.png',
    'public/cliniarco/sala3.png',
    'public/cliniarco/fachadalogo.png',
    'public/cliniarco/aparelhos4.png'
  ];
  
  let totalSize = 0;
  heavyImages.forEach(imagePath => {
    const size = getFileSize(imagePath);
    if (size > 0) {
      console.log(`  - ${imagePath}: ${size}MB`);
      totalSize += parseFloat(size);
    }
  });
  
  console.log(`\n💾 Tamanho total de mídia pesada: ${totalSize.toFixed(2)}MB`);
  return totalSize;
}

// Executar análise
const totalHeavyMedia = listHeavyImages();

console.log('\n✅ Análise concluída!');
console.log('\n🚀 Próximos passos:');
console.log('1. Arquivos pesados foram adicionados ao .vercelignore');
console.log('2. Deploy será muito mais rápido sem esses arquivos');
console.log('3. Use CDN para servir mídia pesada em produção');

if (totalHeavyMedia > 50) {
  console.log('\n⚠️  ATENÇÃO: Projeto ainda tem muita mídia pesada!');
  console.log('   Considere usar um CDN como Cloudinary ou AWS S3');
}