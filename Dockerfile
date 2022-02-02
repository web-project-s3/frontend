###
### Première partie : Compilation du code Typescript
###
FROM node:16.13.1 as tsc-builder
WORKDIR /usr/src/app

# Installation des dépendances et build.
COPY . .
RUN npm install && npm run build

############
### prod ###
############

# base image
FROM nginx:1.16.0-alpine

# copy artifact build from the 'build environment'
# COPY --from=tsc-builder /usr/src/app/dist/frontend /usr/share/nginx/html

COPY --from=tsc-builder /usr/src/app/dist/frontend /usr/share/nginx/html
COPY --from=tsc-builder /usr/src/app/deployment /etc/nginx

# run nginx
CMD ["nginx", "-g", "daemon off;"]
# expose port 80
EXPOSE 80
