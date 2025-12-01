import fs from 'fs-extra';

fs.copySync('src/views', 'dist/src/views', { recursive: true });
fs.copySync('src/public', 'dist/src/public', { recursive: true });
fs.copySync('package.json', 'dist/package.json', { recursive: false });
fs.copySync('package-lock.json', 'dist/package-lock.json', {
  recursive: false,
});
fs.copySync('.env.base', 'dist/.env.base', { recursive: false });
fs.copySync('../Dockerfile', 'dist/Dockerfile', { recursive: false });
fs.copySync('../docker-compose.yaml', 'dist/docker-compose.yaml', {
  recursive: false,
});
try {
  fs.copySync(
    '../docker-compose.override.yaml',
    'dist/docker-compose.override.yaml',
    {
      recursive: false,
    }
  );
} catch (e) {
  console.log('no docker-compose.override');
}
