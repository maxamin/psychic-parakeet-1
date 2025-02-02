docker build --rm -t donft-backend:latest .

docker run --rm  -p 5000:5000 --name donft-backend donft-backend:latest