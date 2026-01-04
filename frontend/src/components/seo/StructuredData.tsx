import { useEffect } from 'react';

export function StructuredData() {
    useEffect(() => {
        // Organization Schema
        const organizationSchema = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'SNORQ',
            url: 'https://snorq.xyz',
            logo: 'https://snorq.xyz/logo.png',
            description: 'All your conversation. One intelligent workspace. Unified inbox for TikTok, WhatsApp, and Messenger business communication.',
            foundingDate: '2025',
            sameAs: [],
            contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Support',
                email: 'support@snorq.xyz'
            }
        };

        // Software Application Schema
        const softwareSchema = {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'SNORQ',
            applicationCategory: 'BusinessApplication',
            applicationSubCategory: 'Communication Software',
            operatingSystem: 'Web',
            description: 'All your conversation. One intelligent workspace. Manage TikTok, WhatsApp, and Messenger in one powerful, unified inbox built for modern teams.',
            offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                availability: 'https://schema.org/PreOrder',
                description: 'Free during beta period'
            },
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.5',
                ratingCount: '1',
                bestRating: '5',
                worstRating: '1'
            },
            featureList: [
                'Unified inbox for TikTok, WhatsApp, and Messenger',
                'Real-time message synchronization',
                'Team collaboration tools',
                'Quick response templates',
                'Multi-channel support'
            ]
        };

        // Website Schema
        const websiteSchema = {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'SNORQ',
            url: 'https://snorq.xyz',
            description: 'All your conversation. One intelligent workspace.',
            potentialAction: {
                '@type': 'SearchAction',
                target: {
                    '@type': 'EntryPoint',
                    urlTemplate: 'https://snorq.xyz/?s={search_term_string}'
                },
                'query-input': 'required name=search_term_string'
            }
        };

        // Add schemas to head
        const addSchema = (id: string, schema: object) => {
            const existing = document.getElementById(id);
            if (existing) existing.remove();

            const script = document.createElement('script');
            script.id = id;
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(schema);
            document.head.appendChild(script);
        };

        addSchema('schema-organization', organizationSchema);
        addSchema('schema-software', softwareSchema);
        addSchema('schema-website', websiteSchema);

        // Cleanup
        return () => {
            document.getElementById('schema-organization')?.remove();
            document.getElementById('schema-software')?.remove();
            document.getElementById('schema-website')?.remove();
        };
    }, []);

    return null;
}
