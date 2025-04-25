import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const enTranslations = {
  header: {
    title: 'Greek Tax Calculator 2025'
  },
  home: {
    title: 'Tax Calculation for Greek Residents (2025)',
    subtitle: 'Calculate your tax obligations for the 2025 tax year with our simple, accurate calculator.'
  },
  calculators: {
    tabs: {
      incomeTax: 'Income Tax',
      withholdingTax: 'Withholding Tax',
      holidayBonus: 'Holiday Bonus',
      explanations: 'Explanations'
    },
    common: {
      calculate: 'Calculate',
      calculating: 'Calculating...',
      familyStatus: 'Family Status',
      single: 'Single',
      married: 'Married',
      children: 'Number of Children',
      gross: 'Gross'
    },
    incomeTax: {
      title: 'Individual Income Tax Calculator',
      familyStatus: 'Family Status',
      employmentIncome: 'Employment Income (€)',
      selfEmploymentIncome: 'Self-Employment Income (€)',
      rentalIncome: 'Rental Income (€)',
      pensionIncome: 'Pension Income (€)',
      medicalExpenses: 'Medical Expenses (€)',
      charitableDonations: 'Charitable Donations (€)',
      resultsTitle: 'Tax Calculation Results',
      totalIncome: 'Total Taxable Income',
      taxRate: 'Tax Rate',
      taxDeductions: 'Tax Deductions',
      incomeTaxAmount: 'Income Tax',
      solidarityAmount: 'Solidarity Contribution',
      totalTax: 'Total Tax Payable'
    },
    withholdingTax: {
      title: 'Employment Withholding Tax Calculator',
      monthlySalary: 'Monthly Gross Salary (€)',
      employmentType: 'Employment Type',
      fullTime: 'Full-time',
      partTime: 'Part-time',
      resultsTitle: 'Withholding Tax Results',
      grossSalary: 'Monthly Gross Salary',
      socialSecurity: 'Social Security Contributions',
      withholdingTaxAmount: 'Withholding Tax',
      netSalary: 'Net Monthly Salary'
    },
    holidayBonus: {
      title: 'Holiday Bonus Calculator',
      monthlySalary: 'Monthly Salary (€)',
      startDate: 'Employment Start Date',
      bonusType: 'Bonus Type',
      christmasBonus: 'Christmas Bonus',
      easterBonus: 'Easter Bonus',
      summerBonus: 'Summer Holiday Bonus',
      paymentDate: 'Payment Date',
      optional: 'optional',
      todayDefault: 'Leave empty to use today\'s date',
      resultsTitle: 'Holiday Bonus Results',
      grossSalary: 'Monthly Gross Salary',
      daysWorked: 'Days Worked in Period',
      days: 'days',
      eligibleAmount: 'Eligible Bonus Amount',
      bonusAmount: 'Gross Bonus Amount',
      taxWithheld: 'Tax Withheld (15%)',
      netBonusAmount: 'Net Bonus Amount'
    },
    explanations: {
      title: 'Tax Explanations',
      incomeTaxExplain: 'Income Tax Explained',
      withholdingExplain: 'Withholding Tax Explained',
      holidayBonusExplain: 'Holiday Bonuses Explained',
      incomeBasics: 'Income Tax Basics',
      incomeRates: 'Income Tax Rates',
      incomeExamples: 'Income Tax Examples',
      withholdingBasics: 'Withholding Tax Basics',
      withholdingRates: 'Withholding Tax Rates',
      withholdingExamples: 'Withholding Tax Examples',
      holidayTypes: 'Types of Holiday Bonuses',
      holidayCalculation: 'How Holiday Bonuses Are Calculated',
      holidayExamples: 'Holiday Bonus Examples'
    }
  },
  disclaimer: {
    title: 'Disclaimer',
    content: 'This is an unofficial tax calculator designed to provide approximate tax information for Greek residents for the 2025 tax year. The calculations are based on our understanding of the tax laws but may not reflect all special cases and exceptions. This tool should not be used as a substitute for professional tax advice. We accept no liability for any decisions made based on the information provided by this calculator.'
  },
  faq: {
    title: 'Frequently Asked Questions',
    items: {
      changes: {
        question: 'What tax changes are expected in Greece for 2025?',
        answer: 'For 2025, Greece is expected to continue its tax reform process with potential adjustments to income tax brackets, deductions for families, and a continued focus on digital tax reporting. The solidarity contribution may be further reduced or eliminated for certain income categories, while incentives for digital transactions may be increased.'
      },
      calculation: {
        question: 'How is income tax calculated in Greece for 2025?',
        answer: 'Greek income tax for 2025 uses a progressive tax system with different rates for various income brackets. For employment income, rates range from 9% for income up to €10,000, 22% for €10,001-€20,000, 28% for €20,001-€30,000, 36% for €30,001-€40,000, and 44% for income above €40,000. Additional factors like family status, number of children, and specific deductions can modify the final tax amount.'
      },
      gift: {
        question: 'What is the gift tax rate in Greece for 2025?',
        answer: 'Gift tax rates in Greece for 2025 depend on the relationship between the donor and recipient. For Category A (close relatives like spouses, children, parents), the tax rate ranges from 1% to 10% with a tax-free threshold of €150,000. For Category B (other relatives like grandchildren, siblings), rates range from 5% to 20% with a tax-free threshold of €30,000. For Category C (other individuals), rates range from 7% to 40% with a tax-free threshold of €6,000.'
      },
      withholding: {
        question: 'How does withholding tax work for employees in Greece in 2025?',
        answer: 'For employees in Greece in 2025, employers are required to withhold income tax from monthly salaries based on projected annual earnings. The withholding is calculated using the progressive tax rates and takes into account the employee\'s family status and number of children. Social security contributions (approximately 13.87% for the employee) are deducted before calculating the withholding tax. This withholding is an advance payment toward the employee\'s annual tax obligation.'
      },
      families: {
        question: 'Are there special tax deductions for families with children in Greece for 2025?',
        answer: 'Yes, for 2025, Greece offers tax benefits for families with children. These include increased tax-free thresholds based on the number of dependent children: €1,000 additional tax-free amount for one child, €2,000 for two children, €5,000 for three children, and an extra €1,000 for each child beyond three. Additionally, certain child-related expenses like education costs can be included in the tax deduction allowed for digital transactions (electronic receipts).'
      }
    }
  },
  footer: {
    title: 'Greek Tax Calculator 2025',
    subtitle: 'Unofficial tax calculations for planning purposes only',
    lastUpdated: 'Last Updated: January 2025'
  }
};

// Greek translations
const elTranslations = {
  header: {
    title: 'Υπολογιστής Φόρων Ελλάδας 2025'
  },
  home: {
    title: 'Υπολογισμός Φόρων για Κατοίκους Ελλάδας (2025)',
    subtitle: 'Υπολογίστε τις φορολογικές σας υποχρεώσεις για το φορολογικό έτος 2025 με τον απλό και ακριβή υπολογιστή μας.'
  },
  calculators: {
    tabs: {
      incomeTax: 'Φόρος Εισοδήματος',
      withholdingTax: 'Παρακράτηση Φόρου',
      holidayBonus: 'Επιδόματα Εορτών',
      explanations: 'Επεξηγήσεις'
    },
    common: {
      calculate: 'Υπολογισμός',
      calculating: 'Υπολογισμός...',
      familyStatus: 'Οικογενειακή Κατάσταση',
      single: 'Άγαμος/η',
      married: 'Έγγαμος/η',
      children: 'Αριθμός Παιδιών',
      gross: 'Μικτά'
    },
    incomeTax: {
      title: 'Υπολογιστής Ατομικού Φόρου Εισοδήματος',
      familyStatus: 'Οικογενειακή Κατάσταση',
      employmentIncome: 'Εισόδημα από Μισθωτή Εργασία (€)',
      selfEmploymentIncome: 'Εισόδημα από Ελεύθερο Επάγγελμα (€)',
      rentalIncome: 'Εισόδημα από Ενοίκια (€)',
      pensionIncome: 'Εισόδημα από Συντάξεις (€)',
      medicalExpenses: 'Ιατρικές Δαπάνες (€)',
      charitableDonations: 'Φιλανθρωπικές Δωρεές (€)',
      resultsTitle: 'Αποτελέσματα Φορολογικού Υπολογισμού',
      totalIncome: 'Συνολικό Φορολογητέο Εισόδημα',
      taxRate: 'Φορολογικός Συντελεστής',
      taxDeductions: 'Φορολογικές Εκπτώσεις',
      incomeTaxAmount: 'Φόρος Εισοδήματος',
      solidarityAmount: 'Εισφορά Αλληλεγγύης',
      totalTax: 'Συνολικός Πληρωτέος Φόρος'
    },
    withholdingTax: {
      title: 'Υπολογιστής Παρακράτησης Φόρου Μισθωτών',
      monthlySalary: 'Μηνιαίος Μικτός Μισθός (€)',
      employmentType: 'Τύπος Απασχόλησης',
      fullTime: 'Πλήρης Απασχόληση',
      partTime: 'Μερική Απασχόληση',
      resultsTitle: 'Αποτελέσματα Υπολογισμού Παρακράτησης',
      grossSalary: 'Μηνιαίος Μικτός Μισθός',
      socialSecurity: 'Ασφαλιστικές Εισφορές',
      withholdingTaxAmount: 'Παρακράτηση Φόρου',
      netSalary: 'Καθαρός Μηνιαίος Μισθός'
    },
    holidayBonus: {
      title: 'Υπολογιστής Επιδομάτων Εορτών',
      monthlySalary: 'Μηνιαίος Μισθός (€)',
      startDate: 'Ημερομηνία Έναρξης Εργασίας',
      bonusType: 'Τύπος Επιδόματος',
      christmasBonus: 'Δώρο Χριστουγέννων',
      easterBonus: 'Δώρο Πάσχα',
      summerBonus: 'Επίδομα Αδείας',
      paymentDate: 'Ημερομηνία Πληρωμής',
      optional: 'προαιρετικό',
      todayDefault: 'Αφήστε κενό για χρήση σημερινής ημερομηνίας',
      resultsTitle: 'Αποτελέσματα Υπολογισμού Επιδόματος',
      grossSalary: 'Μηνιαίος Μικτός Μισθός',
      daysWorked: 'Ημέρες Εργασίας στην Περίοδο',
      days: 'ημέρες',
      eligibleAmount: 'Δικαιούμενο Ποσό Επιδόματος',
      bonusAmount: 'Μικτό Ποσό Επιδόματος',
      taxWithheld: 'Παρακρατούμενος Φόρος (15%)',
      netBonusAmount: 'Καθαρό Ποσό Επιδόματος'
    },
    explanations: {
      title: 'Επεξηγήσεις Φορολογίας',
      incomeTaxExplain: 'Επεξήγηση Φόρου Εισοδήματος',
      withholdingExplain: 'Επεξήγηση Παρακράτησης Φόρου',
      holidayBonusExplain: 'Επεξήγηση Επιδομάτων Εορτών',
      incomeBasics: 'Βασικά Φόρου Εισοδήματος',
      incomeRates: 'Συντελεστές Φόρου Εισοδήματος',
      incomeExamples: 'Παραδείγματα Φόρου Εισοδήματος',
      withholdingBasics: 'Βασικά Παρακράτησης Φόρου',
      withholdingRates: 'Συντελεστές Παρακράτησης Φόρου',
      withholdingExamples: 'Παραδείγματα Παρακράτησης Φόρου',
      holidayTypes: 'Τύποι Επιδομάτων Εορτών',
      holidayCalculation: 'Πώς Υπολογίζονται τα Επιδόματα Εορτών',
      holidayExamples: 'Παραδείγματα Επιδομάτων Εορτών'
    }
  },
  disclaimer: {
    title: 'Αποποίηση Ευθυνών',
    content: 'Αυτός είναι ένας ανεπίσημος φορολογικός υπολογιστής που σχεδιάστηκε για να παρέχει κατά προσέγγιση φορολογικές πληροφορίες για κατοίκους Ελλάδας για το φορολογικό έτος 2025. Οι υπολογισμοί βασίζονται στην κατανόησή μας των φορολογικών νόμων, αλλά ενδέχεται να μην αντικατοπτρίζουν όλες τις ειδικές περιπτώσεις και εξαιρέσεις. Αυτό το εργαλείο δεν πρέπει να χρησιμοποιείται ως υποκατάστατο επαγγελματικών φορολογικών συμβουλών. Δεν αποδεχόμαστε καμία ευθύνη για αποφάσεις που λαμβάνονται με βάση τις πληροφορίες που παρέχονται από αυτόν τον υπολογιστή.'
  },
  faq: {
    title: 'Συχνές Ερωτήσεις',
    items: {
      changes: {
        question: 'Ποιες φορολογικές αλλαγές αναμένονται στην Ελλάδα για το 2025;',
        answer: 'Για το 2025, η Ελλάδα αναμένεται να συνεχίσει τη διαδικασία φορολογικής μεταρρύθμισης με πιθανές προσαρμογές στις κλίμακες φόρου εισοδήματος, τις εκπτώσεις για οικογένειες και συνεχή εστίαση στην ψηφιακή φορολογική αναφορά. Η εισφορά αλληλεγγύης ενδέχεται να μειωθεί περαιτέρω ή να καταργηθεί για ορισμένες κατηγορίες εισοδήματος, ενώ τα κίνητρα για ψηφιακές συναλλαγές ενδέχεται να αυξηθούν.'
      },
      calculation: {
        question: 'Πώς υπολογίζεται ο φόρος εισοδήματος στην Ελλάδα για το 2025;',
        answer: 'Ο ελληνικός φόρος εισοδήματος για το 2025 χρησιμοποιεί ένα προοδευτικό φορολογικό σύστημα με διαφορετικούς συντελεστές για διάφορες εισοδηματικές κλίμακες. Για εισόδημα από μισθωτή εργασία, οι συντελεστές κυμαίνονται από 9% για εισόδημα έως €10.000, 22% για €10.001-€20.000, 28% για €20.001-€30.000, 36% για €30.001-€40.000 και 44% για εισόδημα άνω των €40.000. Πρόσθετοι παράγοντες όπως η οικογενειακή κατάσταση, ο αριθμός των παιδιών και συγκεκριμένες εκπτώσεις μπορούν να τροποποιήσουν το τελικό ποσό του φόρου.'
      },
      gift: {
        question: 'Ποιος είναι ο συντελεστής φόρου δωρεών στην Ελλάδα για το 2025;',
        answer: 'Οι συντελεστές φόρου δωρεών στην Ελλάδα για το 2025 εξαρτώνται από τη σχέση μεταξύ του δωρητή και του αποδέκτη. Για την Κατηγορία Α (στενοί συγγενείς όπως σύζυγοι, παιδιά, γονείς), ο φορολογικός συντελεστής κυμαίνεται από 1% έως 10% με αφορολόγητο όριο €150.000. Για την Κατηγορία Β (άλλοι συγγενείς όπως εγγόνια, αδέλφια), οι συντελεστές κυμαίνονται από 5% έως 20% με αφορολόγητο όριο €30.000. Για την Κατηγορία Γ (άλλα άτομα), οι συντελεστές κυμαίνονται από 7% έως 40% με αφορολόγητο όριο €6.000.'
      },
      withholding: {
        question: 'Πώς λειτουργεί η παρακράτηση φόρου για εργαζομένους στην Ελλάδα το 2025;',
        answer: 'Για τους εργαζομένους στην Ελλάδα το 2025, οι εργοδότες υποχρεούνται να παρακρατούν φόρο εισοδήματος από τους μηνιαίους μισθούς με βάση τα προβλεπόμενα ετήσια εισοδήματα. Η παρακράτηση υπολογίζεται χρησιμοποιώντας τους προοδευτικούς φορολογικούς συντελεστές και λαμβάνει υπόψη την οικογενειακή κατάσταση του εργαζομένου και τον αριθμό των παιδιών. Οι εισφορές κοινωνικής ασφάλισης (περίπου 13,87% για τον εργαζόμενο) αφαιρούνται πριν από τον υπολογισμό του παρακρατούμενου φόρου. Αυτή η παρακράτηση αποτελεί προκαταβολή έναντι της ετήσιας φορολογικής υποχρέωσης του εργαζομένου.'
      },
      families: {
        question: 'Υπάρχουν ειδικές φορολογικές εκπτώσεις για οικογένειες με παιδιά στην Ελλάδα για το 2025;',
        answer: 'Ναι, για το 2025, η Ελλάδα προσφέρει φορολογικά οφέλη για οικογένειες με παιδιά. Αυτά περιλαμβάνουν αυξημένα αφορολόγητα όρια με βάση τον αριθμό των εξαρτώμενων παιδιών: €1.000 επιπλέον αφορολόγητο ποσό για ένα παιδί, €2.000 για δύο παιδιά, €5.000 για τρία παιδιά και επιπλέον €1.000 για κάθε παιδί πέραν των τριών. Επιπλέον, ορισμένα έξοδα που σχετίζονται με παιδιά, όπως τα έξοδα εκπαίδευσης, μπορούν να συμπεριληφθούν στην φορολογική έκπτωση που επιτρέπεται για ψηφιακές συναλλαγές (ηλεκτρονικές αποδείξεις).'
      }
    }
  },
  footer: {
    title: 'Υπολογιστής Φόρων Ελλάδας 2025',
    subtitle: 'Ανεπίσημοι φορολογικοί υπολογισμοί μόνο για σκοπούς σχεδιασμού',
    lastUpdated: 'Τελευταία Ενημέρωση: Ιανουάριος 2025'
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      el: { translation: elTranslations }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
