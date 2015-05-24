#!/bin/sh
mkdir -p ./ssl
cd ./ssl
openssl genrsa -out hacksparrow-key.pem 1024 
openssl req -new -key hacksparrow-key.pem -out certrequest.csr
openssl x509 -req -in certrequest.csr -signkey hacksparrow-key.pem -out hacksparrow-cert.pem
chmod 600 hacksparrow-key.pem
