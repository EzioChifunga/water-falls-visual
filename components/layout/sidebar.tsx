'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { MapPin, Store, Grid3x3, Car, Users, Calendar, CreditCard, History, Menu, X, Package } from 'lucide-react';

const menuItems = [
  { icon: MapPin, label: 'Endereços', href: '/enderecos' },
  { icon: Store, label: 'Lojas', href: '/lojas' },
  { icon: Grid3x3, label: 'Categorias', href: '/categorias' },
  { icon: Car, label: 'Veículos', href: '/veiculos' },
  { icon: Package, label: 'Estoque', href: '/estoque' },
  { icon: Users, label: 'Clientes', href: '/clientes' },
  { icon: Calendar, label: 'Reservas', href: '/reservas' },
  { icon: CreditCard, label: 'Pagamentos', href: '/pagamentos' },
  { icon: History, label: 'Histórico', href: '/historico' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-primary text-primary-foreground"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`fixed inset-y-0 left-0 w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <Car className="w-8 h-8 text-primary" />
            <span className="font-bold text-lg">Falls Cars</span>
          </Link>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="hidden lg:block fixed inset-y-0 left-0 w-64" />
    </>
  );
}
