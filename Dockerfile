###
### Première partie : Compilation du code Typescript
###
FROM node:16.13.1 as tsc-builder
WORKDIR /usr/src/app

# Installation des dépendances et build.
COPY . .
RUN npm install && npm run build

###
### Construction de l'image de production (2ème partie)
###
FROM node:16.13.1 as runtime-container
WORKDIR /usr/src/app

COPY --from=tsc-builder /usr/src/app/dist ./dist
COPY --from=tsc-builder ["/usr/src/app/package.json", "/usr/src/app/package-lock.json", "./"]

############
### prod ###
############

# base image
FROM nginx:1.16.0-alpine

# copy artifact build from the 'build environment'
COPY --from=tsc-builder /usr/src/app/dist/frontend /usr/share/nginx/html
COPY --from=tsc-builder /usr/src/app/nginx.conf /etc/nginx/nginx.conf

# run nginx
CMD ["nginx", "-g", "daemon off;"]
# expose port 80
EXPOSE 80
