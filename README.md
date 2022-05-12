# generate public.key and private.key files and place at root directory of the project

1. openssl genrsa -out private.pem 2048
2. openssl rsa -in private.pem -outform PEM -pubout -out public.pem

// These above two commands generate private.pem and public.pem keys. Rename them from .pem to .key

  // public.pem -> public.key
  
  // private.pem -> private.key
  
  
// Change the password in db.js file. Put your db password there.
