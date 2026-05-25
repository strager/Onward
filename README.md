# tally

This project uses Vite and Vue.js.

## Project setup

```sh
npm install
```

### Compile and hot-reload for development

```sh
npm run dev
```

### Other interesting commands

```sh
npm run type-check
npm run build
```

## Deployment

Deploy the static site to https://onward.strager.dev with Ansible:

```sh
ansible-playbook -i deploy/inventory.ini deploy/playbook.yml
```

Requires Ansible locally and SSH access to the server. `onward.strager.dev` must
resolve to the server before the first deploy (for the TLS certificate).
