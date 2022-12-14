import { Menu, Transition } from '@headlessui/react';
import {
  ArrowLeftOnRectangleIcon,
  BuildingOffice2Icon,
  HeartIcon,
  HomeIcon,
  SparklesIcon,
  UserIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';

type MenuItemProps = {
  label: string;
  icon: (
    props: React.ComponentProps<'svg'> & {
      title?: string;
      titleId?: string;
    }
  ) => JSX.Element;
  href?: string;
  onClick?: any;
}[];

const menuItems: MenuItemProps = [
  {
    label: 'My homes',
    icon: HomeIcon,
    href: '/homes',
  },
  {
    label: 'All Users',
    icon: UsersIcon,
    href: '/users',
  },
  {
    label: 'Companies',
    icon: BuildingOffice2Icon,
    href: '/company',
  },
  {
    label: 'Favorites',
    icon: HeartIcon,
    href: '/favorites',
  },
  {
    label: 'Logout',
    icon: ArrowLeftOnRectangleIcon,
    onClick: signOut,
  },
];

type HeaderProps = {
  openModal: () => void;
};

const Header = ({ openModal }: HeaderProps) => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isLoadingUser = status === 'loading';

  return (
    <header className='h-16 w-full shadow-md'>
      <div className='h-full container mx-auto'>
        <div className='h-full px-4 flex justify-between items-center space-x-4'>
          <Link className='flex items-center space-x-1' href='/' passHref>
            <SparklesIcon className='shrink-0 w-8 h-8 text-indigo-600' />
            <span className='text-xl font-semibold tracking-wide'>
              Supa<span className='text-indigo-600'>Vacation</span>
            </span>
          </Link>
          <div className='flex items-center space-x-4'>
            {isLoadingUser ? (
              <div className='h-8 w-[75px] bg-gray-200 animate-pulse rounded-md' />
            ) : user ? (
              <Menu as='div' className='relative z-50'>
                <Menu.Button className='flex items-center space-x-px group'>
                  <div className='shrink-0 flex items-center justify-center rounded-full overflow-hidden relative bg-gray-200 w-9 h-9'>
                    {user?.image ? (
                      <Image
                        src={user?.image}
                        alt={user?.name || 'Avatar'}
                        width={300}
                        height={300}
                      />
                    ) : (
                      <UserIcon className='text-gray-400 w-6 h-6' />
                    )}
                  </div>
                  <ChevronDownIcon className='w-5 h-5 shrink-0 text-gray-500 group-hover:text-current' />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='opacity-0 scale-95'
                  enterTo='opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='opacity-100 scale-100'
                  leaveTo='opacity-0 scale-95'>
                  <Menu.Items className='absolute right-0 w-72 overflow-hidden mt-1 divide-y divide-gray-100 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                    <div className='flex items-center space-x-2 py-4 px-4 mb-2'>
                      <div className='shrink-0 flex items-center justify-center rounded-full overflow-hidden relative bg-gray-200 w-9 h-9'>
                        {user?.image ? (
                          <Image
                            src={user?.image}
                            alt={user?.name || 'Avatar'}
                            width={300}
                            height={300}
                          />
                        ) : (
                          <UserIcon className='text-gray-400 w-6 h-6' />
                        )}
                      </div>
                      <div className='flex flex-col truncate'>
                        <span>{user?.name}</span>
                        <span className='text-sm text-gray-500'>
                          {user?.email}
                        </span>
                        <strong>{user.role}</strong>
                      </div>
                    </div>

                    <div className='py-2'>
                      {menuItems.map(({ label, href, onClick, icon: Icon }) => (
                        <div
                          key={label}
                          className='px-2 last:border-t last:pt-2 last:mt-2'>
                          <Menu.Item>
                            {href ? (
                              <Link
                                className='flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100'
                                href={href}
                                passHref>
                                <Icon className='w-5 h-5 shrink-0 text-gray-500' />
                                <span>{label}</span>
                              </Link>
                            ) : (
                              <button
                                className='w-full flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100'
                                onClick={onClick}>
                                <Icon className='w-5 h-5 shrink-0 text-yellow-800' />
                                <span>{label}</span>
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <button
                type='button'
                onClick={openModal}
                className='customButton'>
                Log in
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
