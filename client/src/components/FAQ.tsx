import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

export default function FAQ() {
  const { t } = useTranslation();
  
  const faqItems = [
    {
      id: 'calculation',
      question: 'faq.items.calculation.question',
      answer: 'faq.items.calculation.answer'
    },
    {
      id: 'withholding',
      question: 'faq.items.withholding.question',
      answer: 'faq.items.withholding.answer'
    },
    {
      id: 'socialSecurity',
      question: 'faq.items.socialSecurity.question',
      answer: 'faq.items.socialSecurity.answer'
    },
    {
      id: 'taxResidence',
      question: 'faq.items.taxResidence.question',
      answer: 'faq.items.taxResidence.answer'
    },
    {
      id: 'holidayBonuses',
      question: 'faq.items.holidayBonuses.question',
      answer: 'faq.items.holidayBonuses.answer'
    },
    {
      id: 'families',
      question: 'faq.items.families.question',
      answer: 'faq.items.families.answer'
    },
    {
      id: 'digitalReceipts',
      question: 'faq.items.digitalReceipts.question',
      answer: 'faq.items.digitalReceipts.answer'
    },
    {
      id: 'deadlines',
      question: 'faq.items.deadlines.question',
      answer: 'faq.items.deadlines.answer'
    },
    {
      id: 'changes',
      question: 'faq.items.changes.question',
      answer: 'faq.items.changes.answer'
    },
    {
      id: 'gift',
      question: 'faq.items.gift.question',
      answer: 'faq.items.gift.answer'
    }
  ];
  
  return (
    <motion.section 
      className="max-w-4xl mx-auto mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-[#0D5EAF] text-center">
        {t('faq.title')}
      </h2>
      
      <Accordion type="single" collapsible className="space-y-4">
        {faqItems.map((item) => (
          <AccordionItem 
            key={item.id} 
            value={item.id}
            className="border border-gray-200 rounded-lg overflow-hidden bg-white"
          >
            <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
              <span className="font-medium text-left">{t(item.question)}</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <p>{t(item.answer)}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.section>
  );
}
