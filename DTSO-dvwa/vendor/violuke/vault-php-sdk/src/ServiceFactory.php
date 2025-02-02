<?php
namespace Violuke\Vault;

use GuzzleHttp\Client as GuzzleClient;
use Psr\Log\LoggerInterface;

class ServiceFactory
{
    private static $services = [
        'sys' => 'Violuke\Vault\Services\Sys',
        'data' => 'Violuke\Vault\Services\Data',
        'transit' => 'Violuke\Vault\Services\Transit',
        'auth/token' => 'Violuke\Vault\Services\Auth\Token',
    ];

    private $client;

    public function __construct(array $options = array(), LoggerInterface $logger = null, GuzzleClient $guzzleClient = null)
    {
        $this->client = new Client($options, $logger, $guzzleClient);
    }

    public function get($service)
    {
        if (!array_key_exists($service, self::$services)) {
            throw new \InvalidArgumentException(sprintf('The service "%s" is not available. Pick one among "%s".', $service, implode('", "', array_keys(self::$services))));
        }

        $class = self::$services[$service];

        return new $class($this->client);
    }
}
