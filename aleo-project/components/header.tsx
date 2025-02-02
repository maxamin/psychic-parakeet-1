import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Discord', href: 'https://discord.com/channels/954142017556979752/1006590012642558032' },
  { name: 'GitHub', href: 'https://github.com/lilnouns/lilnouns-pics' },
]

export default function Header() {
  return (
    <Popover>
      <div className="tw-max-w-7xl tw-mx-auto tw-px-4 sm:tw-px-6">
        <nav className="tw-relative tw-flex tw-items-center tw-justify-between sm:tw-h-10 md:tw-justify-center" aria-label="Global">
          <div className="tw-flex tw-items-center tw-flex-1 md:tw-absolute md:tw-inset-y-0 md:tw-left-0">
            <div className="tw-flex tw-items-center tw-justify-between tw-w-full md:tw-w-auto">
              <a href="#">
                <span className="tw-sr-only">Lil Nouns Pics</span>
                {/*<img
                      className="tw-h-8 tw-w-auto sm:tw-h-10"
                      src="https://tailwindui.com/img/logos/workflow-mark-neutral-600.svg"
                      alt=""
                    />*/}
              </a>
              <div className="-tw-mr-2 tw-flex tw-items-center md:tw-hidden">
                <Popover.Button className="tw-bg-gray-50 tw-rounded-md tw-p-2 tw-inline-flex tw-items-center tw-justify-center tw-text-gray-400 hover:tw-text-gray-500 hover:tw-bg-gray-100 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-inset focus:tw-ring-neutral-500">
                  <span className="tw-sr-only">Open main menu</span>
                  <Bars3Icon className="tw-h-6 tw-w-6" aria-hidden="true" />
                </Popover.Button>
              </div>
            </div>
          </div>
          <div className="tw-hidden md:tw-flex md:tw-space-x-10">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="tw-font-medium tw-text-gray-500 hover:tw-text-gray-900">
                {item.name}
              </a>
            ))}
          </div>
          {/*<div className="tw-hidden md:tw-absolute md:tw-flex md:tw-items-center md:tw-justify-end md:tw-inset-y-0 md:tw-right-0">
                <span className="tw-inline-flex tw-rounded-md tw-shadow">
                  <a
                    href="#"
                    className="tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-border tw-border-transparent tw-text-base tw-font-medium tw-rounded-md tw-text-neutral-600 tw-bg-white hover:tw-bg-gray-50"
                  >
                    Log in
                  </a>
                </span>
              </div>*/}
        </nav>
      </div>

      <Transition
        as={Fragment}
        enter="duration-150 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="tw-absolute tw-z-10 tw-top-0 tw-inset-x-0 tw-p-2 tw-transition tw-transform tw-origin-top-right md:tw-hidden"
        >
          <div className="tw-rounded-lg tw-shadow-md tw-bg-white tw-ring-1 tw-ring-black tw-ring-opacity-5 tw-overflow-hidden">
            <div className="tw-px-5 tw-pt-4 tw-flex tw-items-center tw-justify-between">
              {/*<div>
                    <img
                      className="tw-h-8 tw-w-auto"
                      src="https://tailwindui.com/img/logos/workflow-mark-neutral-600.svg"
                      alt=""
                    />
                  </div>*/}
              <div className="-tw-mr-2">
                <Popover.Button className="tw-bg-white tw-rounded-md tw-p-2 tw-inline-flex tw-items-center tw-justify-center tw-text-gray-400 hover:tw-text-gray-500 hover:tw-bg-gray-100 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-inset focus:tw-ring-neutral-500">
                  <span className="tw-sr-only">Close menu</span>
                  <XMarkIcon className="tw-h-6 tw-w-6" aria-hidden="true" />
                </Popover.Button>
              </div>
            </div>
            <div className="tw-px-2 tw-pt-2 tw-pb-3">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="tw-block tw-px-3 tw-py-2 tw-rounded-md tw-text-base tw-font-medium tw-text-gray-700 hover:tw-text-gray-900 hover:tw-bg-gray-50"
                >
                  {item.name}
                </a>
              ))}
            </div>
            {/*<a
                  href="#"
                  className="tw-block tw-w-full tw-px-5 tw-py-3 tw-text-center tw-font-medium tw-text-neutral-600 tw-bg-gray-50 hover:tw-bg-gray-100"
                >
                  Log in
                </a>*/}
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
