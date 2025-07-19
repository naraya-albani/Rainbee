import AppLogoIcons from '@/components/app-logo-text';
import QuantitySelector from '@/components/incrementDecrementBtn';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { Auth, CartForm, Product } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { History, LogOut, Mail, Phone, ShoppingCart, User } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa6';
import { toast } from 'sonner';

const siteData = {
    appName: import.meta.env.VITE_APP_NAME,
    tagline: 'Tetes Murni, Energi Alami. ',
};

const navLinks = ['Beranda', 'Produk', 'Keunggulan', 'FAQ', 'Kontak'];

type Props = {
    auth: Auth;
    product: Product[];
};

interface WhyChooseUsItem {
    title: string;
    desc: string;
    icon: string;
}

const whyChooseUs: WhyChooseUsItem[] = [
    {
        title: 'Madu Asli Bondowoso',
        desc: 'Rainbee menghadirkan madu murni yang bersumber langsung dari alam Bondowoso yang terjaga kualitasnya.',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 mx-auto mb-4 text-[#f59e0b]"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`,
    },
    {
        title: 'Kualitas Terjamin',
        desc: 'Setiap tetes Rainbee melewati prosesQuality Control ketat untuk memastikan kemurnian dan manfaatnya bagi Anda.',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 mx-auto mb-4 text-[#f59e0b]"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`,
    },
    {
        title: 'Praktis dan Mudah',
        desc: 'Dapatkan Rainbee dengan mudah melalui pemesanan online. Cukup beberapa klik, manfaat madu alami sampai ke rumah Anda.',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 mx-auto mb-4 text-[#f59e0b]"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`,
    },
    {
        title: 'Harga Terjangkau',
        desc: 'Nikmati madu alami berkualitas tinggi dari Bondowoso dengan harga yang bersahabat.',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 mx-auto mb-4 text-[#ffa407]"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V6.375c0-.621.504-1.125 1.125-1.125h.375m18 3.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75m0 0h.375c.621 0 1.125.504 1.125 1.125v.75c0 .621-.504 1.125-1.125 1.125h-.375m0 0h.75a.75.75 0 0 0 .75-.75v-.75a.75.75 0 0 0-.75-.75h-.75M3 12h18M3 15h18" /></svg>`,
    },
    {
        title: 'Dukungan Pelanggan',
        desc: 'Tim Rainbee siap membantu Anda dengan informasi produk dan layanan kami melalui berbagai saluran komunikasi.',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 mx-auto mb-4 text-[#ffa407]"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-2.138a.5.5 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.227V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>`,
    },
];

const contactInfo = {
    whatsapp: '+62 812 3456 7890',
};

interface FaqItem {
    id: string;
    question: string;
    answer: string;
}

interface Faq1Props {
    heading?: string;
    items?: FaqItem[];
}

const faqs: Faq1Props = {
    heading: 'Frequently Asked Questions',
    items: [
        {
            id: 'faq-1',
            question: 'What is a FAQ?',
            answer: 'A FAQ is a list of frequently asked questions and answers on a particular topic.',
        },
        {
            id: 'faq-2',
            question: 'What is the purpose of a FAQ?',
            answer: 'The purpose of a FAQ is to provide answers to common questions and help users find the information they need quickly and easily.',
        },
        {
            id: 'faq-3',
            question: 'How do I create a FAQ?',
            answer: 'To create a FAQ, you need to compile a list of common questions and answers on a particular topic and organize them in a clear and easy-to-navigate format.',
        },
        {
            id: 'faq-4',
            question: 'What are the benefits of a FAQ?',
            answer: 'The benefits of a FAQ include providing quick and easy access to information, reducing the number of support requests, and improving the overall user experience.',
        },
        {
            id: 'faq-5',
            question: 'How should I organize my FAQ?',
            answer: 'You should organize your FAQ in a logical manner, grouping related questions together and ordering them from most basic to more advanced topics.',
        },
        {
            id: 'faq-6',
            question: 'How long should FAQ answers be?',
            answer: 'FAQ answers should be concise and to the point, typically a few sentences or a short paragraph is sufficient for most questions.',
        },
        {
            id: 'faq-7',
            question: 'Should I include links in my FAQ?',
            answer: 'Yes, including links to more detailed information or related resources can be very helpful for users who want to learn more about a particular topic.',
        },
    ],
};

interface Contact7Props {
    title?: string;
    description?: string;
    emailLabel?: string;
    emailDescription?: string;
    email?: string;
    officeLabel?: string;
    officeDescription?: string;
    officeAddress?: string;
    phoneLabel?: string;
    phoneDescription?: string;
    phone1?: string;
    phone2?: string;
    chatLabel?: string;
    chatDescription?: string;
    chatLink?: string;
}

const contact: Contact7Props = {
    title: 'Hubungi Kami',
    description: 'Kami siap membantu Anda dengan pertanyaan atau informasi lebih lanjut.',
    emailLabel: 'Email',
    emailDescription: 'Kirimkan pertanyaan atau permintaan Anda melalui email.',
    email: 'rainbee.madu@gmail.com',
    phoneLabel: 'Telfon',
    phoneDescription: 'Hubungi kami melalui telfon untuk bantuan cepat.',
    phone1: '081249900122 (Niswa)',
    phone2: '085158662580 (Rainbee)',
};

interface MenuItem {
    title: string;
    links: {
        text: string;
        url: string;
    }[];
}

interface Footer2Props {
    tagline?: string;
    menuItems?: MenuItem[];
    copyright?: string;
    bottomLinks?: {
        text: string;
        url: string;
    }[];
}

const footerData: Footer2Props = {
    tagline:
        'Rainbee adalah madu alami asli Bondowoso yang murni, praktis untuk didapatkan, dan sangat bermanfaat bagi kesehatan Anda. Madu alami yang berkualitas tinggi, siap memberikan manfaat yang optimal.',
    menuItems: [
        {
            title: 'Product',
            links: [
                { text: 'Overview', url: '#' },
                { text: 'Pricing', url: '#' },
                { text: 'Marketplace', url: '#' },
                { text: 'Features', url: '#' },
                { text: 'Integrations', url: '#' },
                { text: 'Pricing', url: '#' },
            ],
        },
        {
            title: 'Company',
            links: [
                { text: 'About', url: '#' },
                { text: 'Team', url: '#' },
                { text: 'Blog', url: '#' },
                { text: 'Careers', url: '#' },
                { text: 'Contact', url: '#' },
                { text: 'Privacy', url: '#' },
            ],
        },
        {
            title: 'Resources',
            links: [
                { text: 'Help', url: '#' },
                { text: 'Sales', url: '#' },
                { text: 'Advertise', url: '#' },
            ],
        },
        {
            title: 'Social',
            links: [
                { text: 'Twitter', url: '#' },
                { text: 'Instagram', url: '#' },
                { text: 'LinkedIn', url: '#' },
            ],
        },
    ],
};

const providers = [
    { name: 'WhatsApp', icon: <FaWhatsapp className="h-5 w-5" />, href: 'https://www.whatsapp.com' },
    { name: 'Instagram', icon: <FaInstagram className="h-5 w-5" />, href: 'https://www.instagram.com/rainbee.madu/' },
    { name: 'Telepon', icon: <Phone className="h-5 w-5" />, href: `tel:${contactInfo.whatsapp}` },
    { name: 'Surel', icon: <Mail className="h-5 w-5" />, href: `mailto:${contact.email}` },
];

export default function Welcome({ auth, product }: Props) {
    const [selectedProduct, setSelectedProduct] = useState<Product>();
    const [quantity, setQuantity] = useState<number>(1);
    const [openPopup, setOpenPopup] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const { setData, post, processing } = useForm<Required<CartForm>>({
        id: 0,
        product_id: 0,
        quantity: 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('keranjang'), {
            onSuccess: () => {
                setOpenPopup(false);
                router.reload({
                    only: ['product'],
                });
                toast.success('Pesanan berhasil masuk ke keranjang!');
            },
        });
    };

    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    const toggleMobileMenu = () => {
        setMobileOpen((prev) => !prev);
    };

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] lg:justify-center dark:bg-[#0a0a0a]">
                <header className="bg-opacity-90 sticky top-0 z-50 bg-[#1b1b18] backdrop-blur-md dark:bg-[#1b1b18]">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                        <a href="#beranda" className="flex flex-shrink-0 items-center space-x-2" aria-label="Homepage">
                            <span className="hidden text-xl font-bold text-[#f59e0b] sm:inline">{import.meta.env.VITE_APP_NAME}</span>
                        </a>

                        <nav className="hidden flex-grow items-center justify-center space-x-4 md:flex">
                            {navLinks.map((link) => {
                                const href = `#${link.toLowerCase().replace(/ /g, '-')}`;
                                return (
                                    <a
                                        key={link}
                                        href={href}
                                        className="rounded-md px-3 py-2 text-sm font-medium text-[#f59e0b] transition-colors duration-200 hover:bg-yellow-900 hover:text-white dark:hover:bg-yellow-600 dark:hover:text-yellow-200"
                                    >
                                        {link}
                                    </a>
                                );
                            })}
                        </nav>

                        <div className="md:hidden">
                            <button
                                onClick={toggleMobileMenu}
                                className="rounded p-1 text-white hover:bg-yellow-900 focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset"
                                aria-label="Toggle Menu"
                                aria-expanded={mobileOpen}
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            </button>
                        </div>
                        <div className="hidden items-center space-x-4 md:flex">
                            {auth.user ? (
                                <>
                                    {auth.user.role === 'admin' && (
                                        <Link
                                            href={route('dashboard')}
                                            className="inline-block rounded-sm bg-[#f59e0b] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                        >
                                            Dashboard
                                        </Link>
                                    )}

                                    {auth.user.role === 'user' && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="inline-block rounded-sm bg-[#f59e0b] px-5 py-1.5 text-sm leading-normal text-[#EDEDEC] hover:border-[#1915014a] hover:text-[#f59e0b] dark:border-[#3E3E3A] dark:hover:border-[#62605b]"
                                                >
                                                    <User></User>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={route('keranjang')}>
                                                        <ShoppingCart />
                                                        Lihat Keranjang
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={route('riwayat')}>
                                                        <History />
                                                        Riwayat
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        className="block w-full"
                                                        method="post"
                                                        href={route('logout')}
                                                        as="button"
                                                        onClick={handleLogout}
                                                    >
                                                        <LogOut />
                                                        Log out
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="inline-block rounded-sm border border-[#f59e0b] px-5 py-1.5 text-sm leading-normal text-white hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-block rounded-sm bg-[#f59e0b] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}

                            <div className="relative">
                                <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 transform"></span>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <nav
                        id="mobile-menu"
                        className={`absolute top-full right-0 left-0 border-t border-[#1b1b18] bg-[#1b1b18] py-2 shadow-lg transition-all duration-300 ease-in-out md:hidden ${
                            mobileOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
                        }`}
                    >
                        {navLinks.map((link) => {
                            const href = `#${link.toLowerCase().replace(/ /g, '-')}`;
                            return (
                                <a key={link} href={href} className="mx-2 block rounded px-4 py-2 text-center text-white hover:bg-yellow-900">
                                    {link}
                                </a>
                            );
                        })}
                        <hr className="mx-4 my-2 border-t border-black" />
                        <div className="mb-2 space-y-2 px-4">
                            {auth.user ? (
                                <>
                                    <Link
                                        href={route('keranjang')}
                                        className="block w-full rounded px-4 py-2 text-center text-sm text-white hover:bg-yellow-200"
                                    >
                                        Keranjang
                                    </Link>
                                    <Link
                                        href={route('riwayat')}
                                        className="block w-full rounded px-4 py-2 text-center text-sm text-white hover:bg-yellow-200"
                                    >
                                        Riwayat
                                    </Link>
                                    <Link
                                        method="post"
                                        href={route('logout')}
                                        as="button"
                                        onClick={handleLogout}
                                        className="block w-full rounded bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
                                    >
                                        Logout
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="block w-full rounded bg-white px-4 py-2 text-sm text-[#1b1b18] hover:bg-yellow-200"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="block w-full rounded bg-white px-4 py-2 text-sm text-[#1b1b18] hover:bg-yellow-200"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                <section id="home">
                    <div className="relative min-h-screen bg-gray-400 bg-[url('bg-web.jpg')] bg-cover bg-center bg-no-repeat bg-blend-multiply md:py-20">
                        <div className="absolute right-0 bottom-0 left-0 z-10 h-32 bg-gradient-to-b from-transparent to-background"></div>
                        <div className="mb-16 text-center md:mb-20">
                            <div className="mb-4 flex items-center justify-center">
                                <AppLogoIcons className="h-30 w-auto max-lg:h-12" />
                            </div>
                            <p className="mx-auto mb-10 max-w-3xl px-4 text-lg text-white md:text-xl">{siteData.tagline}</p>

                            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <a
                                    href="#produk"
                                    className="inline-flex transform items-center justify-center rounded-md border border-transparent bg-[#f59e0b] px-8 py-3 text-base font-medium text-white shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:bg-yellow-500 hover:shadow-xl"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mr-2 h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                    Lihat Layanan
                                </a>

                                <a
                                    href="#kontak"
                                    className="inline-flex transform items-center justify-center rounded-md border-2 border-white px-8 py-3 text-base font-medium text-white shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:bg-[#f59e0b] hover:text-white hover:shadow-xl"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mr-2 h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                    Hubungi Kami
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="produk" className="min-h-screen py-12 md:py-16">
                    <div className="flex justify-center">
                        <div className="w-full px-4 text-center sm:px-6 lg:px-8">
                            <h2 className="mb-4 text-3xl font-bold text-[#f59e0b] md:text-4xl">Produk Kami</h2>
                            <p className="mx-auto max-w-3xl text-lg text-primary md:text-xl">
                                Madu alami berkualitas tinggi dari Bondowoso, siap memberikan manfaat yang optimal.
                            </p>
                            <div className="mx-auto mt-6 flex max-w-screen flex-wrap items-center justify-center gap-9">
                                {product.map((product) => {
                                    return (
                                        <Card key={product.id} className="w-[350px] overflow-hidden">
                                            <img
                                                src={`/storage/${product.image}`}
                                                alt={product.name}
                                                className="h-[180px] w-full rounded-t-lg object-cover"
                                            />
                                            <CardContent className="px-4 pb-2 text-left">
                                                <CardTitle className="mb-1 text-xl font-semibold">{product.name}</CardTitle>
                                                <p className="mb-4 text-2xl font-bold text-[#f59e0b]">
                                                    Rp{new Intl.NumberFormat('id-ID').format(Number(product.price))}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="default" className="bg-primary text-primary-foreground duration-200">
                                                        {product.size} ml
                                                    </Badge>
                                                    <Badge variant="default" className="bg-primary text-primary-foreground duration-200">
                                                        Stok: {product.stock}
                                                    </Badge>
                                                </div>
                                            </CardContent>

                                            <CardFooter className="p-4 pt-0">
                                                <Button
                                                    className="w-full"
                                                    onClick={() => {
                                                        if (!auth.user?.id) {
                                                            router.visit(route('login'));
                                                            return;
                                                        }

                                                        setData({
                                                            id: auth.user.id,
                                                            product_id: product.id,
                                                            quantity: 1,
                                                        });
                                                        setSelectedProduct(product);
                                                        setQuantity(1);
                                                        setOpenPopup(true);
                                                    }}
                                                >
                                                    Beli sekarang
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    );
                                })}
                            </div>
                            {openPopup && selectedProduct && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                                    <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-md bg-white p-6 shadow-lg">
                                        <div className="mb-4 flex items-center justify-between border-b pb-2">
                                            <h2 className="text-lg font-semibold">Detail Produk</h2>
                                            <button
                                                onClick={() => setOpenPopup(false)}
                                                className="text-xl font-bold text-gray-500 hover:text-red-500"
                                            >
                                                ×
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <img
                                                src={`/storage/${selectedProduct.image}`}
                                                alt="Madu Alami"
                                                className="h-[180px] w-full rounded-t-lg object-cover"
                                            />
                                            <div className="flex flex-col">
                                                <h1 className="mb-2 text-left text-xl font-bold text-[#f59e0b]">{selectedProduct.name}</h1>
                                                <p className="text-left text-sm text-gray-700">{selectedProduct.description}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="default" className="bg-primary text-primary-foreground duration-200">
                                                        {selectedProduct.size} ml
                                                    </Badge>
                                                    <Badge variant="default" className="bg-primary text-primary-foreground duration-200">
                                                        Stok: {selectedProduct.stock}
                                                    </Badge>
                                                </div>
                                                <QuantitySelector
                                                    value={quantity}
                                                    min={1}
                                                    max={selectedProduct.stock}
                                                    onChange={(val) => {
                                                        setQuantity(val);
                                                        setData((prev) => ({
                                                            ...prev,
                                                            quantity: val,
                                                        }));
                                                    }}
                                                />
                                                <div className="grid grid-cols-2">
                                                    <p className="text-left">harga</p>
                                                    <p className="text-right font-bold text-[#f59e0b]">
                                                        Rp
                                                        {new Intl.NumberFormat('id-ID').format(quantity * Number(selectedProduct.price))}
                                                    </p>
                                                </div>

                                                <Button className="mt-5" onClick={submit} disabled={processing}>
                                                    <ShoppingCart />
                                                    Tambahkan Keranjang
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section id="keunggulan" className="py-12 md:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-10 text-center md:mb-12">
                            <h2 className="mb-4 text-3xl font-bold text-[#f59e0b] md:text-4xl">Mengapa Memilih Rainbee?</h2>
                            <p className="mx-auto max-w-3xl text-lg text-primary md:text-xl">
                                Madu alami asli Bondowoso yang murni, praktis untuk didapatkan, dan sangat bermanfaat bagi kesehatan Anda.
                            </p>
                        </div>

                        <div className="-mx-4 flex flex-wrap justify-center">
                            {whyChooseUs.map((item, index) => (
                                <div key={index} className="mb-6 w-full rounded-lg px-4 md:w-1/2 lg:w-1/3">
                                    <div className="h-full rounded-xl p-8 text-center shadow-lg transition-shadow duration-300 hover:shadow-xl">
                                        <div dangerouslySetInnerHTML={{ __html: item.icon }} />
                                        <h3 className="mb-2 text-lg font-bold text-primary">{item.title}</h3>
                                        <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="faq" className="p-4 py-32 sm:p-6 lg:p-8">
                    <div className="container mx-auto min-h-screen max-w-3xl">
                        <h1 className="mb-4 text-3xl font-semibold text-[#ffa407] md:mb-11 md:text-4xl">{faqs.heading}</h1>
                        <Accordion type="single" collapsible>
                            {faqs.items?.map((item, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="font-semibold text-primary hover:no-underline">{item.question}</AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </section>
                <section id="kontak" className="bg-background p-4 py-32 sm:p-6 lg:p-8">
                    <div className="container mx-auto">
                        <div className="mb-14">
                            <h1 className="mt-2 mb-3 text-3xl font-semibold text-[#f59e0b] md:text-4xl">{contact.title}</h1>
                            <p className="max-w-xl text-lg text-muted-foreground">{contact.description}</p>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="rounded-lg bg-muted p-6">
                                <span className="mb-3 flex size-12 flex-col items-center justify-center rounded-full bg-accent">
                                    <Mail className="h-6 w-auto text-primary" />
                                </span>
                                <p className="mb-2 text-lg font-semibold text-primary">{contact.emailLabel}</p>
                                <p className="mb-3 text-muted-foreground">{contact.emailDescription}</p>
                                <a href={`mailto:${contact.email}`} className="font-semibold text-primary hover:underline">
                                    {contact.email}
                                </a>
                            </div>

                            <div className="rounded-lg bg-muted p-6">
                                <span className="mb-3 flex size-12 flex-col items-center justify-center rounded-full bg-accent">
                                    <Phone className="h-6 w-auto text-primary" />
                                </span>
                                <p className="mb-2 text-lg font-semibold text-primary">{contact.phoneLabel}</p>
                                <p className="mb-3 text-muted-foreground">{contact.phoneDescription}</p>
                                <a href={`tel:${contact.phone1}`} className="font-semibold text-primary hover:underline">
                                    {contact.phone1}
                                </a>
                                <p className="font-semibold text-primary hover:underline">{contact.phone2}</p>
                            </div>
                            <div className="col-span-full mt-6">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31594.412854934653!2d113.721344!3d-8.1723392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd695b617d8f623%3A0xf6c4437632474338!2sPoliteknik%20Negeri%20Jember!5e0!3m2!1sid!2sid!4v1752216074517!5m2!1sid!2sid"
                                    className="w-full rounded-lg"
                                    height="500"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="p-4 pt-32 sm:p-6 lg:p-8">
                    <div className="container mx-auto">
                        <footer>
                            <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
                                <div className="col-span-3 mb-8 lg:mb-0">
                                    <img src="/logo-type.png" alt="" width={240} />
                                    <p className="my-4 font-bold text-muted-foreground">{footerData.tagline}</p>
                                    <div className="flex gap-2">
                                        {providers.map((provider) => (
                                            <a key={provider.name} href={provider.href} target="_blank" rel="noopener noreferrer">
                                                <Button
                                                    size="icon"
                                                    className="rounded-lg border border-gray-700 bg-black text-white hover:bg-zinc-900"
                                                >
                                                    {provider.icon}
                                                </Button>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-span-3">
                                    <h3 className="mb-4 text-xl font-bold text-foreground">Mau ke mana lagi?</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <Button asChild>
                                            <a href="#beranda">Beranda</a>
                                        </Button>
                                        <Button asChild>
                                            <a href="#produk">Produk</a>
                                        </Button>
                                        <Button asChild>
                                            <a href="#keunggulan"> Keunggulan</a>
                                        </Button>
                                        <Button asChild>
                                            <a href="#faq">FAQ</a>
                                        </Button>
                                        <Button asChild>
                                            <a href="#kontak">Kontak</a>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-24 flex flex-col gap-4 border-t py-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
                                <img src="/polije.png" alt="Polije" width={200} className="block dark:hidden" />
                                <img src="/polije-dark.png" alt="Polije" width={200} className="hidden dark:block" />
                                <img src="/logo-blu.png" width={50} />
                                <img src="/logo_jpt.png" width={180} />
                                <img src="/logo-jti.png" width={130} />
                            </div>
                        </footer>
                    </div>
                </section>
            </div>
        </>
    );
}
