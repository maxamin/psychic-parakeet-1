# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  
  config.vm.box = "bento/ubuntu-20.04"

  
  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  # config.vm.network "private_network", ip: "192.168.33.10"
  config.vm.network "private_network", ip: "10.0.0.80"

  
  config.vm.provider "virtualbox" do |vb|
    # Display the VirtualBox GUI when booting the machine
    vb.gui = true
    # Customize the amount of memory on the VM:
    vb.memory = "2048"
    vb.customize [ "modifyvm", :id, "--uartmode1", "file", File::NULL ]
  end

  

  config.vm.provision "shell",
    inline: "sudo apt -y install ansible"
  

  config.vm.provision "file", source: "ansible", destination: "/home/vagrant/ansible"

  config.vm.provision "ansible_local" do |ansible|
    ansible.playbook = "ansible/main.yaml"
    ansible.provisioning_path = "/home/vagrant/"
  end

  config.vm.synced_folder '.', '/vagrant', disabled: true

end
