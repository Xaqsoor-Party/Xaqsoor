import { useState } from "react";
import styles from "@/styles/Home.module.css";
import {
    FiUser, FiCalendar, FiDollarSign,
    FiBarChart2, FiSettings, FiMap, FiImage, FiBook, FiUsers, FiFlag, FiShield
} from "react-icons/fi";
import { FaHandHoldingHeart } from "react-icons/fa";
import { ImNewspaper } from "react-icons/im";
import Link from "next/link";

const HomePage = () => {
    const [activeCard, setActiveCard] = useState<string | null>(null);

    // Feature cards data
    const features = [
        {
            id: "profile",
            title: "Your Profile",
            description: "Manage your personal information, communication preferences, and profile settings",
            icon: <FiUser size={36} />,
            path: "/settings/edit-profile",
            color: "var(--color-primary)",
            stats: "Complete your profile to access all features"
        },
        {
            id: "membership",
            title: "Membership Status",
            description: "View your membership details, renewal date, and upgrade options",
            icon: <FiUser size={36} />,
            path: "/membership",
            color: "var(--color-secondary)",
            stats: "Active until June 30, 2024"
        },
        {
            id: "events",
            title: "Upcoming Events",
            description: "Discover and register for party events, meetings, and community activities",
            icon: <FiCalendar size={36} />,
            path: "/events",
            color: "var(--color-primary-light)",
            stats: "3 events near you this week"
        },
        {
            id: "news",
            title: "Xaqsoor News",
            description: "Stay updated with the latest announcements, policy updates, and party news",
            icon: <ImNewspaper size={36} />,
            path: "/news",
            color: "var(--color-primary-lighter)",
            stats: "12 new articles this week"
        },
        {
            id: "constituencies",
            title: "Your Constituency",
            description: "Connect with local representatives and see activities in your area",
            icon: <FiMap size={36} />,
            path: "/constituencies",
            color: "var(--color-secondary-dark)",
            stats: "Connect with 5 representatives"
        },
        {
            id: "gallery",
            title: "Media Gallery",
            description: "Browse photos and videos from recent events and campaigns",
            icon: <FiImage size={36} />,
            path: "/gallery",
            color: "var(--color-primary-accent)",
            stats: "124 new photos added"
        },
        {
            id: "donate",
            title: "Support Xaqsoor",
            description: "Contribute to our campaigns and see how your donations make a difference",
            icon: <FaHandHoldingHeart size={36} />,
            path: "/donate",
            color: "var(--color-secondary)",
            stats: "Help us reach our $50k goal"
        },
        {
            id: "manifesto",
            title: "Our Manifesto",
            description: "Read Xaqsoor's vision and policies",
            icon: <FiBook size={36} />,
            path: "/manifesto",
            color: "var(--color-primary-light)",
            stats: "Learn about our commitments"
        }
    ];

    return (
        <div className={styles.dashboard}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>Welcome to the Xaqsoor Membership Portal</h1>
                    <p>Your central hub for engagement, information, and participation in our party&apos;s activities.</p>
                    <div className={styles.heroStats}>
                        <div className={styles.statItem}>
                            <FiUser className={styles.statIcon} />
                            <div>
                                <span className={styles.statValue}>24,589</span>
                                <span className={styles.statLabel}>Active Members</span>
                            </div>
                        </div>
                        <div className={styles.statItem}>
                            <FiCalendar className={styles.statIcon} />
                            <div>
                                <span className={styles.statValue}>48</span>
                                <span className={styles.statLabel}>Upcoming Events</span>
                            </div>
                        </div>
                        <div className={styles.statItem}>
                            <FiBarChart2 className={styles.statIcon} />
                            <div>
                                <span className={styles.statValue}>84%</span>
                                <span className={styles.statLabel}>Engagement Rate</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* System Explanation */}
            <section className={styles.explanation}>
                <h2>Your Xaqsoor Membership Portal</h2>
                <p className={styles.subtitle}>
                    This system helps you stay connected with the Xaqsoor political movement.
                    Manage your membership, participate in events, and help shape our future.
                </p>

                <div className={styles.featureGrid}>
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            className={`${styles.featureCard} ${activeCard === feature.id ? styles.active : ''}`}
                            onMouseEnter={() => setActiveCard(feature.id)}
                            onMouseLeave={() => setActiveCard(null)}
                            style={{ borderTopColor: feature.color }}
                        >
                            <div className={styles.cardIcon} style={{ color: feature.color }}>
                                {feature.icon}
                            </div>
                            <div className={styles.cardContent}>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                                <div className={styles.cardStats}>{feature.stats}</div>
                            </div>
                            <a href={feature.path} className={styles.cardButton}>
                                Explore
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            {/* Party Principles */}
            <section className={styles.principles}>
                <div className={styles.sectionHeader}>
                    <h2>Xaqsoor Core Principles</h2>
                    <p className={styles.subtitle}>
                        The values that guide our political movement and vision for the future
                    </p>
                </div>

                <div className={styles.principlesGrid}>
                    <div className={styles.principleCard}>
                        <div className={styles.principleIcon} style={{ backgroundColor: "var(--color-primary-transparent)" }}>
                            <FiUsers size={24} />
                        </div>
                        <h3>Inclusive Governance</h3>
                        <p>Ensuring all voices are heard in the political process</p>
                    </div>

                    <div className={styles.principleCard}>
                        <div className={styles.principleIcon} style={{ backgroundColor: "rgba(234, 83, 60, 0.1)" }}>
                            <FiFlag size={24} />
                        </div>
                        <h3>National Progress</h3>
                        <p>Building a prosperous future for all citizens</p>
                    </div>

                    <div className={styles.principleCard}>
                        <div className={styles.principleIcon} style={{ backgroundColor: "var(--color-primary-transparent)" }}>
                            <FiShield size={24} />
                        </div>
                        <h3>Integrity & Transparency</h3>
                        <p>Accountable leadership with clear decision-making</p>
                    </div>

                    <div className={styles.principleCard}>
                        <div className={styles.principleIcon} style={{ backgroundColor: "rgba(234, 83, 60, 0.1)" }}>
                            <FiBook size={24} />
                        </div>
                        <h3>Evidence-Based Policy</h3>
                        <p>Solutions grounded in research and data</p>
                    </div>
                </div>
            </section>


            {/* Call to Action */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaCard}>
                    <div className={styles.ctaContent}>
                        <h3>Join the Movement</h3>
                        <p>Stay informed about Xaqsoor&apos;s initiatives and participate in shaping our political future.</p>
                        <div className={styles.ctaStats}>
                            <div className={styles.ctaStat}>
                                <span>Community</span>
                                <strong>24K+ Members</strong>
                            </div>
                            <div className={styles.ctaStat}>
                                <span>Engagement</span>
                                <strong>84% Active</strong>
                            </div>
                        </div>
                    </div>
                    <div className={styles.ctaButtons}>
                        <button className={styles.primaryButton}>Update Preferences</button>
                        <button className={styles.secondaryButton}>Invite Friends</button>
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            <section className={styles.quickLinks}>
                <h3>Quick Access</h3>
                <div className={styles.linkGrid}>
                    <Link href="/campaign/events" className={styles.linkCard}>
                        <FiCalendar className={styles.linkIcon} />
                        <span>Register for Events</span>
                    </Link>
                    <Link href="/settings/profile" className={styles.linkCard}>
                        <FiUser className={styles.linkIcon} />
                        <span>Update Your Profile</span>
                    </Link>
                    <Link href="/donate" className={styles.linkCard}>
                        <FiDollarSign className={styles.linkIcon} />
                        <span>Make a Donation</span>
                    </Link>
                    <Link href="/settings" className={styles.linkCard}>
                        <FiSettings className={styles.linkIcon} />
                        <span>Account Settings</span>
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default HomePage;