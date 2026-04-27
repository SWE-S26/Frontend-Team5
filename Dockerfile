FROM node:20-slim AS builder
WORKDIR /beatza
COPY package*.json ./
RUN npm install 
COPY . .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_USE_MSW
ENV NEXT_PUBLIC_USE_MSW=$NEXT_PUBLIC_USE_MSW
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_SOCKET_URL
ENV NEXT_PUBLIC_SOCKET_URL=$NEXT_PUBLIC_SOCKET_URL
RUN npm run build
 
FROM node:20-slim AS production
WORKDIR /beatza
COPY --from=builder /beatza/.next/standalone ./
COPY --from=builder /beatza/.next/static ./.next/static
COPY --from=builder /beatza/public ./public
EXPOSE 3000
CMD ["node", "server.js"]