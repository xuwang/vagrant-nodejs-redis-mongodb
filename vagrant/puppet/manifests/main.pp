class apt_update {
    exec { "aptGetUpdate":
        command => "sudo apt-get update",
        path => ["/bin", "/usr/bin"]
    }
}

class othertools {
    package { "git":
        ensure => latest,
        require => Exec["aptGetUpdate"]
    }

    package { "vim-common":
        ensure => latest,
        require => Exec["aptGetUpdate"]
    }

    package { "curl":
        ensure => present,
        require => Exec["aptGetUpdate"]
    }

    package { "htop":
        ensure => present,
        require => Exec["aptGetUpdate"]
    }

    package { "g++":
        ensure => present,
        require => Exec["aptGetUpdate"]
    }
}

class nodejs {
  exec { "git_clone_n":
    command => "git clone https://github.com/visionmedia/n.git /home/vagrant/n",
    path => ["/bin", "/usr/bin"],
    require => [Exec["aptGetUpdate"], Package["git"], Package["curl"], Package["g++"]]
  }

  exec { "install_n":
    command => "make install",
    path => ["/bin", "/usr/bin"],
    cwd => "/home/vagrant/n",
    require => Exec["git_clone_n"]
  }

  exec { "install_node":
    command => "n stable",
	timeout => 600,
    path => ["/bin", "/usr/bin", "/usr/local/bin"],  
    require => [Exec["git_clone_n"], Exec["install_n"]]
  }
  
  exec { "install_slush":
  	command => "npm i -g gulp slush slush-ng",
	timeout => 600,
	path => ["/bin", "/usr/bin", "/usr/local/bin"],
	cwd => "/home/vagrant",
	require => Exec["install_node"]
  }
}

class mongodb {
  class {'::mongodb::globals':
    manage_package_repo => true,
    bind_ip             => ["127.0.0.1"],
  }->
  class {'::mongodb::server':
    port    => 27017,
    verbose => true,
    ensure  => "present"
  }->
  class {'::mongodb::client': }
}

class redis-cl {
  class { 'redis': }
}

# preferred symlink syntax
file { '/home/vagrant/shared':
   ensure => 'link',
   target => '/vagrant',
}


include apt_update
include othertools
include nodejs
include mongodb
include redis-cl
