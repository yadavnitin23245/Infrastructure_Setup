In CI (GitHub Actions)

Reference the correct Dockerfiles:

- name: Build API
  run: docker build -f docker/dev/Dockerfile.api -t my-api:${{ github.run_number }} .

- name: Build Web
  run: docker build -f docker/dev/Dockerfile.web -t my-web:${{ github.run_number }} .