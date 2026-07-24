'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import FactorMark from '@/components/factor/factor-mark';
import TrackedLink from '@/components/tracked-link';

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, margin: '0px 0px -80px 0px' } as const;

interface AiPathsProps {
  byoTitle: string;
  byoDescription: string;
  inHouseTitle: string;
  inHouseDescription: string;
  inHouseItems: string[];
  inHouseHref: string;
  inHouseLinkLabel: string;
}

export default function AiPaths({
  byoTitle,
  byoDescription,
  inHouseTitle,
  inHouseDescription,
  inHouseItems,
  inHouseHref,
  inHouseLinkLabel,
}: AiPathsProps) {
  const reduce = useReducedMotion();

  const cardVariants = (delay: number): Variants =>
    reduce
      ? {
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { duration: 0.4, delay } },
        }
      : {
          hidden: { opacity: 0, y: 24 },
          show: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: EASE } },
        };

  const itemVariants: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, x: -18 },
        show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
      };

  const hover = reduce ? undefined : { y: -3, transition: { duration: 0.2, ease: 'easeOut' } };

  return (
    <>
      <motion.div
        variants={cardVariants(0)}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        whileHover={hover}
        className="rounded-xl border border-gray-800 bg-gray-900/40 p-5 md:p-6 transition-colors duration-300 hover:border-gray-600"
      >
        <h3 className="text-xl font-semibold text-gray-100">{byoTitle}</h3>
        <p className="mt-2 text-gray-300">{byoDescription}</p>
      </motion.div>
      <motion.div
        variants={cardVariants(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        whileHover={hover}
        className="rounded-xl border border-sky-500/40 bg-gray-900/40 p-5 md:p-6 shadow-lg shadow-sky-500/10 transition-colors duration-300 hover:border-sky-400/70"
      >
        <div className="flex items-start gap-3">
          <FactorMark size={36} className="flex-shrink-0" />
          <h3 className="mt-1 text-xl font-semibold text-gray-100">{inHouseTitle}</h3>
        </div>
        <p className="mt-2 text-gray-300">{inHouseDescription}</p>
        <motion.ul
          variants={{
            hidden: {},
            show: {
              transition: reduce ? undefined : { staggerChildren: 0.08, delayChildren: 0.25 },
            },
          }}
          className="mt-4 space-y-3"
        >
          {inHouseItems.map((item, index) => (
            <motion.li key={index} variants={itemVariants} className="flex items-start">
              <div className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-sky-300 to-sky-600">
                <ChevronRight className="h-4 w-4 text-black" />
              </div>
              <span className="leading-6 text-gray-300">{item}</span>
            </motion.li>
          ))}
        </motion.ul>
        <TrackedLink
          href={inHouseHref}
          trackingKey="aiSectionMeetFactor"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-sky-400 transition-colors hover:text-sky-300"
        >
          {inHouseLinkLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </TrackedLink>
      </motion.div>
    </>
  );
}
