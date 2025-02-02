from flask import Flask, jsonify, request
import requests
import ipfshttpclient
import os

app = Flask(__name__)

@app.route('/applyModification', methods=['GET'])

@app.route('/applyModification', methods=['POST'])
def applyModification():
    body = request.get_json(force=True)
    origianlUrl = body['origianlUrl']
    modificatorUrl = body['modificatorUrl']

    resultUrl = process_files(origianlUrl, modificatorUrl)
    return resultUrl

def process_files(origianlUrl, modificatorUrl):
# save files to file
    original_image = requests.get(origianlUrl, allow_redirects=True)
    open('origianl.jpg', 'wb').write(original_image.content)

    modificator_image = requests.get(modificatorUrl, allow_redirects=True)
    open('modificator.jpg', 'wb').write(modificator_image.content)
    
    result_file_name = "result.jpg"
# launch ml
   # os.popen("/home/dariasamsonova/first-order-model/Demo.py --config /home/dariasamsonova/first-order-model/config/vox-256.yaml --checkpoint /home/dariasamsonova/first-order-model/vox-cpk.pth.tar --source_image /home/dariasamsonova/backend/origianl.jpg --driving_video /home/dariasamsonova/backend/modificator.mp4 --result_video /home/dariasamsonova/backend/result.mp4 --cpu")
# read file
#/dns/ipfs-api.example.com/tcp/443/https
    ipfs_url = "/dns4/ipfs.infura.io/tcp/5001/https"
    #"/dns/ipfs.io/tcp/443/https"
   # client = ipfshttpclient.connect(ipfs_url)
    #res = client.add(result_file_name)

# save to ipfs

    #return ipfs_url + res['Hash']
    return ipfs_url

    
if __name__ == "__main__":
    app.run()

