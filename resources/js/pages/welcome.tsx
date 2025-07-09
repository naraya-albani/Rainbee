import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Mail, MapPin, MessageCircle, Phone, PiggyBank } from 'lucide-react';
import { useState } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';


const siteData = {
    appName: import.meta.env.VITE_APP_NAME,
    tagline: 'Tetes Murni, Energi Alami. ',
    features: [
        { title: 'Booking Mudah', desc: 'Pesan layanan hanya dalam beberapa klik.' },
        { title: 'Pembayaran Digital', desc: 'Mendukung berbagai metode pembayaran modern.' },
        { title: 'Layanan Terpercaya', desc: 'Mitra bengkel berkualitas dan terpercaya.' },
    ],
};

const navLinks = ['Beranda', 'Layanan', 'Tentang Kami', 'Kontak'];

interface WhyChooseUsItem {
    title: string;
    desc: string;
    icon: string; // SVG string
}

const whyChooseUs: WhyChooseUsItem[] = [
    {
        title: 'Keahlian Terjamin',
        desc: 'Mekanik kami diseleksi ketat dan bersertifikat, memastikan penanganan terbaik untuk mobil Anda.',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 mx-auto mb-4 text-indigo-600"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`,
    },
    {
        title: 'Kualitas Terpercaya',
        desc: 'Kami hanya menggunakan suku cadang asli atau setara OEM dengan garansi untuk ketenangan Anda.',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 mx-auto mb-4 text-indigo-600"><path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.375 3.375 0 0 0-4.773-4.773L6.75 15.17l2.472 2.472a3.375 3.375 0 0 0 4.773-4.773l-.709-.708M6.75 15.17l-2.472 2.472a3.375 3.375 0 0 0 4.773 4.773L11.42 21M12 6.375 13.808 8.183a.75.75 0 0 1 .324 1.023l-1.096 1.942a.75.75 0 0 1-1.3-.732l1.096-1.942a.75.75 0 0 1 .324-1.023L12 6.375Zm0 0L10.192 8.183a.75.75 0 0 0-.324 1.023l1.096 1.942a.75.75 0 0 0 1.3-.732l-1.096-1.942a.75.75 0 0 0-.324-1.023L12 6.375Z" /></svg>`,
    },
    {
        title: 'Kenyamanan Maksimal',
        desc: 'Layanan 24/7 dan proses pemesanan online yang praktis menghemat waktu dan tenaga Anda.',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 mx-auto mb-4 text-indigo-600"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`,
    },
    {
        title: 'Biaya Jujur',
        desc: 'Dapatkan estimasi biaya yang jelas di awal tanpa khawatir biaya tak terduga.',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 mx-auto mb-4 text-indigo-600"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V6.375c0-.621.504-1.125 1.125-1.125h.375m18 3.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75m0 0h.375c.621 0 1.125.504 1.125 1.125v.75c0 .621-.504 1.125-1.125 1.125h-.375m0 0h.75a.75.75 0 0 0 .75-.75v-.75a.75.75 0 0 0-.75-.75h-.75M3 12h18M3 15h18" /></svg>`,
    },
    {
        title: 'Dukungan Pelanggan Responsif',
        desc: 'Tim kami siap membantu menjawab pertanyaan Anda melalui berbagai kanal komunikasi.',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 mx-auto mb-4 text-indigo-600"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-2.138a.5.5 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.227V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>`,
    },
];

const sampleReviews = [
    {
        name: 'Andi',
        teks_review: 'Layanannya sangat memuaskan!',
        rating: 5,
        tgl_review: '2025-07-08',
    },
    {
        name: 'Budi',
        teks_review: 'Prosesnya cepat dan mudah.',
        rating: 4,
        tgl_review: '2025-07-07',
    },
];

const contactInfo = {
    whatsapp: '+62 812 3456 7890',
    hotline: '0800-123-456',
    social_media: '@mechaban_id',
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
    heading: 'Frequently asked questions',
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
    phone?: string;
    chatLabel?: string;
    chatDescription?: string;
    chatLink?: string;
}

const contact: Contact7Props = {
    title: 'Contact Us',
    description: 'Contact the support team at Shadcnblocks.',
    emailLabel: 'Email',
    emailDescription: 'We respond to all emails within 24 hours.',
    email: 'example@shadcnblocks.com',
    officeLabel: 'Office',
    officeDescription: 'Drop by our office for a chat.',
    officeAddress: '1 Eagle St, Brisbane, QLD, 4000',
    phoneLabel: 'Phone',
    phoneDescription: "We're available Mon-Fri, 9am-5pm.",
    phone: '+123 456 7890',
    chatLabel: 'Live Chat',
    chatDescription: 'Get instant help from our support team.',
    chatLink: 'Start Chat',
};

interface MenuItem {
    title: string;
    links: {
        text: string;
        url: string;
    }[];
}

interface Footer2Props {
    logo?: {
        url: string;
        src: string;
        alt: string;
    };
    tagline?: string;
    menuItems?: MenuItem[];
    copyright?: string;
    bottomLinks?: {
        text: string;
        url: string;
    }[];
}

const footerData: Footer2Props = {
    logo: {
        src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg',
        alt: 'blocks for shadcn/ui',
        url: 'https://www.shadcnblocks.com',
    },
    tagline: 'Components made easy.',
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
    copyright: '© 2024 Shadcnblocks.com. All rights reserved.',
    bottomLinks: [
        { text: 'Terms and Conditions', url: '#' },
        { text: 'Privacy Policy', url: '#' },
    ],
};

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileOpen((prev) => !prev);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const whatsappNumber = contactInfo.whatsapp.replace(/[^0-9]/g, '');
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=Halo%20,%20saya%20ingin%20bertanya%20tentang%20layanan...`;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] lg:justify-center dark:bg-[#0a0a0a]">
                <header className="sticky top-0 z-50 border-b border-blue-700/50 bg-blue-600">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                        <a href="#home" className="flex flex-shrink-0 items-center space-x-2" aria-label="Homepage">
                            {/* <Image src="/img/Logo putih Mechaban 1.png" alt={`Logo ${appName}`} width={100} height={50} className="h-10 w-20" /> */}
                            <span className="hidden text-xl font-bold text-white sm:inline">{import.meta.env.VITE_APP_NAME}</span>
                        </a>

                        <nav className="hidden flex-grow items-center justify-center space-x-4 md:flex">
                            {navLinks.map((link) => {
                                const href = `#${link.toLowerCase().replace(/ /g, '-')}`;
                                return (
                                    <a
                                        key={link}
                                        href={href}
                                        className="rounded-md px-3 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-yellow-900"
                                    >
                                        {link}
                                    </a>
                                );
                            })}
                        </nav>

                        <div className="md:hidden">
                            <button
                                onClick={toggleMobileMenu}
                                className="rounded p-1 text-white hover:bg-blue-500 focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset"
                                aria-label="Toggle Menu"
                                aria-expanded={mobileOpen}
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            </button>
                        </div>

                        <div className="hidden items-center space-x-4 md:flex">
                            <Link
                                href={route('login')}
                                className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                            >
                                Log in
                            </Link>
                            <Link
                                href={route('register')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Register
                            </Link>
                            <div className="relative">

                                <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 transform">

                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <nav
                        id="mobile-menu"
                        className={`absolute top-full right-0 left-0 border-t border-blue-500 bg-blue-600 py-2 shadow-lg transition-all duration-300 ease-in-out md:hidden ${
                            mobileOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
                        }`}
                    >
                        {navLinks.map((link) => {
                            const href = `#${link.toLowerCase().replace(/ /g, '-')}`;
                            return (
                                <a key={link} href={href} className="mx-2 block rounded px-4 py-2 text-center text-white hover:bg-blue-500">
                                    {link}
                                </a>
                            );
                        })}
                        <hr className="mx-4 my-2 border-t border-blue-500" />
                        <div className="mb-2 space-y-2 px-4">
                            <Link
                                href={route('login')}
                                className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                            >
                                Log in
                            </Link>
                            <Link
                                href={route('register')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Register
                            </Link>
                        </div>
                    </nav>
                </header>
                <section id="home" className="bg-feature-bg py-16 md:py-20">
                    <div className="container mx-auto px-4 text-center">
                        <div className="mb-16 text-center md:mb-20">
                            <div className="mb-4 flex items-center justify-center">
                                <AppLogoIcon className="h-30 w-auto" />

                                <h1 className="bg-gradient-to-r from-yellow-300 via-yellow-600 to-yellow-700 bg-clip-text pb-2 text-5xl font-extrabold text-transparent md:text-6xl lg:text-7xl">
                                    {siteData.appName}
                                </h1>
                            </div>

                            <p className="mx-auto mb-10 max-w-3xl px-4 text-lg text-gray-600 md:text-xl">{siteData.tagline}</p>

                            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <a
                                    href="#layanan"
                                    className="inline-flex transform items-center justify-center rounded-md border border-transparent bg-yellow-400 px-8 py-3 text-base font-medium text-black shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:bg-yellow-500 hover:shadow-xl"
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
                                    className="inline-flex transform items-center justify-center rounded-md border border-yellow-400 bg-white px-8 py-3 text-base font-medium text-yellow-400 shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:bg-yellow-500 hover:text-white hover:shadow-xl"
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

                        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                            <div className="-mx-3 flex flex-wrap justify-center">
                                {siteData.features.map((feature, index) => (
                                    <div key={index} className="mb-6 w-full px-3 sm:w-1/2 lg:w-1/3">
                                        <div className="flex h-full transform flex-col items-center rounded-xl border-t-4 border-transparent bg-white p-6 text-center shadow-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.03] hover:border-indigo-500 hover:shadow-xl">
                                            <div className="mb-4 text-indigo-500">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="mx-auto h-10 w-10"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={1}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                                    />
                                                </svg>
                                            </div>
                                            <h3 className="mb-2 text-lg font-semibold text-gray-900">{feature.title}</h3>
                                            <p className="text-sm leading-relaxed text-gray-600">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
                <section id="layanan" className="py-12 md:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-10 text-center md:mb-12">
                            <h2 className="mb-4 text-3xl font-bold text-blue-700 md:text-4xl">Mengapa Memilih Mechaban?</h2>
                            <p className="mx-auto max-w-3xl text-lg text-gray-600 md:text-xl">
                                Kami menawarkan solusi otomotif online yang handal, mudah, dan menguntungkan untuk Anda.
                            </p>
                        </div>

                        <div className="-mx-4 flex flex-wrap justify-center">
                            {whyChooseUs.map((item, index) => (
                                <div key={index} className="mb-6 w-full px-4 md:w-1/2 lg:w-1/3">
                                    <div className="h-full rounded-xl bg-white p-8 text-center shadow-lg transition-shadow duration-300 hover:shadow-xl">
                                        <div dangerouslySetInnerHTML={{ __html: item.icon }} />
                                        <h3 className="mb-2 text-lg font-semibold text-gray-800">{item.title}</h3>
                                        <p className="text-sm leading-relaxed text-gray-600">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                <section id="tentang-kami" className="py-12 md:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-10 text-center md:mb-12">
                            <h2 className="mb-3 text-3xl font-bold text-blue-700 md:text-4xl">Apa Kata Pelanggan Kami?</h2>
                            <p className="mx-auto max-w-2xl text-lg text-gray-600">Pengalaman nyata dari pengguna layanan.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {sampleReviews.map((review, index) => (
                                <article key={index} className="flex h-full flex-col rounded-xl bg-white p-6 shadow-lg">
                                    <div className="mb-4 flex items-center">
                                        <div className="mr-3 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-300 font-bold text-gray-600 uppercase">
                                            {review.name.charAt(0)}
                                        </div>
                                        <span className="text-base font-semibold text-gray-800">{review.name}</span>
                                    </div>
                                    <blockquote className="flex-grow text-sm text-gray-700 italic">
                                        <p>"{review.teks_review}"</p>
                                    </blockquote>
                                    <div className="mt-4 text-sm text-gray-500">
                                        Rating: {review.rating} / 5
                                        <br />
                                        Tanggal Review: {formatDate(review.tgl_review)}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
                <section id="kontak" className="py-12 md:py-16">
                    <div className="flex justify-center">
                        <div className="w-full max-w-2xl px-4 text-center sm:px-6 lg:px-8">
                            <div className="flex flex-col items-center gap-6">
                                <h2 className="text-3xl font-bold text-blue-700">Hubungi Kami</h2>

                                <div className="space-y-5 text-lg text-gray-900">
                                    <div>
                                        <span className="block text-sm font-medium tracking-wider text-gray-500 uppercase">WhatsApp</span>
                                        <p className="mt-1">{contactInfo.whatsapp}</p>
                                    </div>
                                    <div>
                                        <span className="block text-sm font-medium tracking-wider text-gray-500 uppercase">Hotline</span>
                                        <p className="mt-1">{contactInfo.hotline}</p>
                                    </div>
                                    <div>
                                        <span className="block text-sm font-medium tracking-wider text-gray-500 uppercase">Media Sosial</span>
                                        <p className="mt-1">{contactInfo.social_media}</p>
                                    </div>
                                </div>

                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center rounded-lg bg-green-500 px-8 py-3 text-lg font-bold text-white transition duration-300 hover:bg-green-600"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.498 1.803 6.286l-.935 3.42z" />
                                    </svg>
                                    Chat via WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-32">
                    <div className="container mx-auto max-w-3xl">
                        <h1 className="mb-4 text-3xl font-semibold md:mb-11 md:text-4xl">{faqs.heading}</h1>
                        <Accordion type="single" collapsible>
                            {faqs.items?.map((item, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="font-semibold hover:no-underline">{item.question}</AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </section>
                <section className="bg-background py-32">
                    <div className="container mx-auto">
                        <div className="mb-14">
                            <h1 className="mt-2 mb-3 text-3xl font-semibold text-balance md:text-4xl">{contact.title}</h1>
                            <p className="max-w-xl text-lg text-muted-foreground">{contact.description}</p>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="rounded-lg bg-muted p-6">
                                <span className="mb-3 flex size-12 flex-col items-center justify-center rounded-full bg-accent">
                                    <Mail className="h-6 w-auto" />
                                </span>
                                <p className="mb-2 text-lg font-semibold">{contact.emailLabel}</p>
                                <p className="mb-3 text-muted-foreground">{contact.emailDescription}</p>
                                <a href={`mailto:${contact.email}`} className="font-semibold hover:underline">
                                    {contact.email}
                                </a>
                            </div>
                            <div className="rounded-lg bg-muted p-6">
                                <span className="mb-3 flex size-12 flex-col items-center justify-center rounded-full bg-accent">
                                    <MapPin className="h-6 w-auto" />
                                </span>
                                <p className="mb-2 text-lg font-semibold">{contact.officeLabel}</p>
                                <p className="mb-3 text-muted-foreground">{contact.officeDescription}</p>
                                <a href="#" className="font-semibold hover:underline">
                                    {contact.officeAddress}
                                </a>
                            </div>
                            <div className="rounded-lg bg-muted p-6">
                                <span className="mb-3 flex size-12 flex-col items-center justify-center rounded-full bg-accent">
                                    <Phone className="h-6 w-auto" />
                                </span>
                                <p className="mb-2 text-lg font-semibold">{contact.phoneLabel}</p>
                                <p className="mb-3 text-muted-foreground">{contact.phoneDescription}</p>
                                <a href={`tel:${contact.phone}`} className="font-semibold hover:underline">
                                    {contact.phone}
                                </a>
                            </div>
                            <div className="rounded-lg bg-muted p-6">
                                <span className="mb-3 flex size-12 flex-col items-center justify-center rounded-full bg-accent">
                                    <MessageCircle className="h-6 w-auto" />
                                </span>
                                <p className="mb-2 text-lg font-semibold">{contact.chatLabel}</p>
                                <p className="mb-3 text-muted-foreground">{contact.chatDescription}</p>
                                <a href="#" className="font-semibold hover:underline">
                                    {contact.chatLink}
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="pt-32">
                    <div className="container mx-auto">
                        <footer>
                            <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
                                <div className="col-span-2 mb-8 lg:mb-0">
                                    <div className="flex items-center gap-2 lg:justify-start">
                                        <PiggyBank className="size-10 text-foreground" />
                                        <p className="text-xl font-semibold text-foreground">{import.meta.env.VITE_APP_NAME}</p>
                                    </div>
                                    <p className="mt-4 font-bold text-muted-foreground">{footerData.tagline}</p>
                                </div>
                                {footerData.menuItems?.map((section, sectionIdx) => (
                                    <div key={sectionIdx}>
                                        <h3 className="mb-4 font-bold text-foreground">{section.title}</h3>
                                        <ul className="space-y-4 text-muted-foreground">
                                            {section.links.map((link, linkIdx) => (
                                                <li key={linkIdx} className="font-medium hover:text-primary">
                                                    <a href={link.url}>{link.text}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-24 flex flex-col justify-between gap-4 border-t py-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
                                <p>{footerData.copyright}</p>
                                <ul className="flex gap-4">
                                    {footerData.bottomLinks?.map((link, linkIdx) => (
                                        <li key={linkIdx} className="underline hover:text-primary">
                                            <a href={link.url}>{link.text}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </footer>
                    </div>
                </section>
            </div>
        </>
    );
}
