import { ColumnDef } from '@tanstack/react-table';

interface DataType {
  [key: string]: string | number;
}

export interface DiseaseManagementStatusItemType {
  img: string;
  title: string;
  counts: [number, number];
  data: DataType[];
  columns: ColumnDef<DataType>[];
  pdf: string;
}

const curableData = [
  {
    names: 'Abscess',
    curable: 'curable',
    introduction: 'Pus builds up in tissues and is usually caused by a bacterial infection.',
  },
  {
    names: 'Acne',
    curable: 'curable',
    introduction: 'Chronic inflammation of the pilosebaceous glands, commonly seen in adolescents.',
  },
  {
    names: 'Acute bronchitis',
    curable: 'curable',
    introduction: 'Acute inflammation of the bronchus, usually caused by a viral infection.',
  },
  {
    names: 'Age-related hearing loss',
    curable: 'incurable',
    introduction: 'High-frequency hearing loss that occurs gradually with aging.',
  },
  {
    names: 'Allergic rhinitis',
    curable: 'incurable',
    introduction: 'A chronic inflammatory reaction of the nasal mucosa to allergens, leading to nasal congestion and sneezing.',
  },
  {
    names: 'Allergies',
    curable: 'incurable',
    introduction: 'An abnormal reaction of the immune system to harmless substances causes a variety of symptoms.',
  },
  {
    names: 'Anemia',
    curable: 'curable',
    introduction:
      'Insufficient number or function of red blood cells due to various causes (e.g., iron deficiency, chronic diseases).',
  },
  {
    names: 'Arthritis',
    curable: 'incurable',
    introduction: 'Inflammation of joints, including osteoarthritis and rheumatoid arthritis.',
  },
  {
    names: 'Asthma',
    curable: 'incurable',
    introduction: 'Chronic airway inflammation leads to wheezing and dyspnea.',
  },
  {
    names: 'Asthma in children',
    curable: 'incurable',
    introduction: 'Childhood-onset airway hyperresponsiveness disease.',
  },
  {
    names: 'Astigmatism',
    curable: 'incurable',
    introduction: 'Blurred vision due to abnormal curvature of the cornea or lens.',
  },
  {
    names: 'Atherosclerosis',
    curable: 'incurable',
    introduction: 'Lipid plaque builds up on the arterial walls, leading to narrowing or hardening of the vessels.',
  },
  {
    names: 'Attention deficit hyperactivity disorder',
    curable: 'incurable',
    introduction: 'Neurodevelopmental disorder characterized by inattention and hyperactivity.',
  },
  {
    names: 'Birthmarks - pigmented',
    curable: 'incurable',
    introduction: 'Abnormal accumulation of skin pigment cells (e.g., cafe-au-lait spots, Mongolian spots).',
  },
  {
    names: 'Breast cancer',
    curable: 'curable',
    introduction: 'Breast tissue malignant tumors, early detection of the prognosis is better.',
  },
  {
    names: 'Bruise',
    curable: 'curable',
    introduction: 'Rupture of a blood vessel under the skin causes local cyanosis, which usually clears up spontaneously.',
  },
  {
    names: 'Cancer',
    curable: 'incurable',
    introduction: 'There are various types of malignant tumors formed by abnormal proliferation of cells.',
  },
  {
    names: 'Cataract - adult',
    curable: 'curable',
    introduction: 'The opacity of the lens causes vision loss.',
  },
  {
    names: 'Chapped lips',
    curable: 'curable',
    introduction:
      'The skin of the lips is dry and desquamated, mostly due to the dry environment or the habit of licking lips.',
  },
  {
    names: 'Comedones',
    curable: 'curable',
    introduction: 'Blackheads or whiteheads caused by blockage of pilosebaceous glands.',
  },
  {
    names: 'Common cold',
    curable: 'curable',
    introduction: 'Viral infections of the upper respiratory tract, self-limited.',
  },
  {
    names: 'Conjunctivitis or pink eye',
    curable: 'curable',
    introduction: 'Inflammation of the conjunctiva, which may be caused by viruses, bacteria, or allergies.',
  },
  {
    names: 'Coronavirus disease 2019 (COVID-19)',
    curable: 'curable',
    introduction:
      'Severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) infection, which affects the respiratory tract and other organs.',
  },
  {
    names: 'Dental cavities',
    curable: 'curable',
    introduction: 'Dental enamel is eroded by bacteria to form cavities.',
  },
  {
    names: 'Depression',
    curable: 'incurable',
    introduction: 'Persistent low mood, loss of interest, and possible relapse.',
  },
  {
    names: 'Diabetes',
    curable: 'incurable',
    introduction: 'Defects in insulin secretion or action lead to chronic hyperglycemia.',
  },
  {
    names: 'Diaper rash',
    curable: 'curable',
    introduction: 'Inflammation of the skin on the buttocks of infants caused by dampness or friction.',
  },
  {
    names: 'Diarrhea',
    curable: 'curable',
    introduction: 'Increased or loose bowel movements, often caused by infection or food intolerance.',
  },
  {
    names: 'Dizziness',
    curable: 'curable',
    introduction: 'Abnormal balance or vertigo, with various causes (e.g., otolithiasis).',
  },
  {
    names: 'Ear infection - acute',
    curable: 'curable',
    introduction: 'A bacterial or viral infection of the middle ear, commonly seen in children.',
  },
  {
    names: 'Eczema',
    curable: 'incurable',
    introduction: 'A chronic inflammatory skin condition characterized by pruritus and erythema.',
  },
  {
    names: 'Eye redness',
    curable: 'curable',
    introduction: 'Conjunctival congestion, which can be caused by infection, allergies, or fatigue.',
  },
  {
    names: 'Fatigue',
    curable: 'incurable',
    introduction: 'Persistent tiredness, which may be caused by anemia, thyroid disease, etc.',
  },
  {
    names: 'Fever',
    curable: 'curable',
    introduction: 'Increased body temperature, usually as a result of infection or inflammation.',
  },
  {
    names: 'Flu',
    curable: 'curable',
    introduction: 'Respiratory tract infections caused by influenza viruses are self-healing.',
  },
  {
    names: 'Gastroesophageal reflux disease',
    curable: 'incurable',
    introduction: 'Reflux of stomach acid into the esophagus can cause heartburn.',
  },
  {
    names: 'Generalized anxiety disorder',
    curable: 'incurable',
    introduction: 'Persistent excessive worry with somatic symptoms.',
  },
  {
    names: 'Gingivitis',
    curable: 'curable',
    introduction: 'Inflammation of the gums, often due to plaque accumulation.',
  },
  {
    names: 'Headache',
    curable: 'curable',
    introduction: 'It can be caused by migraines, nervousness, or organic diseases.',
  },
  {
    names: 'Hearing loss',
    curable: 'incurable',
    introduction: 'Sensorineural or conductive hearing loss, which may be permanent.',
  },
  {
    names: 'Heart attack',
    curable: 'incurable',
    introduction: 'Occlusion of the coronary artery leads to ischemic necrosis of the myocardium.',
  },
  {
    names: 'Heart disease',
    curable: 'incurable',
    introduction:
      'A collective term for abnormalities in the structure or function of the heart (e.g., coronary heart disease, cardiomyopathy).',
  },
  {
    names: 'Heart failure',
    curable: 'incurable',
    introduction: 'The pumping function of the heart is reduced and it cannot meet the needs of the body.',
  },
  {
    names: 'Heartburn',
    curable: 'curable',
    introduction: 'A burning sensation caused by reflux of stomach acid into the esophagus.',
  },
  {
    names: 'Hemorrhoids',
    curable: 'curable',
    introduction: 'Anal varices, internal hemorrhoids and external hemorrhoids.',
  },
  {
    names: 'High blood cholesterol levels',
    curable: 'incurable',
    introduction: 'Blood cholesterol levels are elevated, increasing cardiovascular risk.',
  },
  {
    names: 'igh blood pressure in adults – hypertension',
    curable: 'incurable',
    introduction: 'Long-term blood pressure increases, damaging the heart and blood vessels.',
  },
  {
    names: 'Indigestion',
    curable: 'curable',
    introduction: 'Epigastric discomfort, often caused by diet or gastroesophageal reflux.',
  },
  {
    names: 'Insect bites and stings',
    curable: 'curable',
    introduction: 'Local or allergic reactions caused by bites from mosquitoes, bees, etc.',
  },
  {
    names: 'Insomnia',
    curable: 'incurable',
    introduction: 'Persistent difficulty falling asleep or maintaining sleep.',
  },
];

const manageableData = [
  {
    nameOfDisease: 'Gastric adenocarcinoma and proximal polyposis of the stomach',
    manageable: 'Uncontrollable',
    possibleCause: 'APC gene mutations',
  },
  {
    nameOfDisease: 'Primary condylar hyperplasia',
    manageable: 'Uncontrollable',
    possibleCause: 'Genetic factors, hormone abnormalities, trauma',
  },
  {
    nameOfDisease: 'Pseudoxanthoma elasticum',
    manageable: 'Uncontrollable',
    possibleCause: 'ABCC6 gene mutation',
  },
  {
    nameOfDisease: 'Periodic fever-immunodeficiency-thrombocytopenia syndrome',
    manageable: 'Uncontrollable',
    possibleCause: 'Genetic mutations',
  },
  {
    nameOfDisease: 'Benign idiopathic neonatal seizures',
    manageable: 'Manageable',
    possibleCause: 'Metabolic abnormalities due to genetic factors',
  },
  {
    nameOfDisease: 'Congenital ptosis',
    manageable: 'Manageable',
    possibleCause: 'Levator palpebrae superioris hypoplasia oculomotor nerve palsy',
  },
  {
    nameOfDisease: 'Ganglioneuroma',
    manageable: 'Manageable',
    possibleCause: 'Abnormal proliferation of neural crest cells',
  },
  {
    nameOfDisease: 'Loiasis',
    manageable: 'Manageable',
    possibleCause: 'Loiasis filarial infection',
  },
  {
    nameOfDisease: 'Carney complex-trismus-pseudocamptodactyly syndrome',
    manageable: 'Uncontrollable',
    possibleCause: 'Genetic mutation PRKAR1A gene mutation',
  },
  {
    nameOfDisease: 'Scarring in glaucoma filtration surgical procedures',
    manageable: 'Manageable',
    possibleCause: 'Surgical trauma, inflammatory response, fibrosis',
  },
  {
    nameOfDisease: 'Intellectual disability-strabismus syndrome',
    manageable: 'Uncontrollable',
    possibleCause: 'Genetic mutations',
  },
  {
    nameOfDisease: 'Subependymal giant cell astrocytoma',
    manageable: 'Manageable',
    possibleCause: 'Mutations in TSC1 or TSC2 genes',
  },
  {
    nameOfDisease: 'Autosomal recessive intermediate Charcot-Marie-Tooth disease type B',
    manageable: 'Uncontrollable',
    possibleCause: 'GDAP1 gene mutation',
  },
  {
    nameOfDisease: 'PENS syndrome',
    manageable: 'Uncontrollable',
    possibleCause: 'Genetic mutations Neurodevelopmental abnormalities',
  },
  {
    nameOfDisease: 'Isolated ulnar hemimelia',
    manageable: 'Uncontrollable',
    possibleCause: 'Genetic factors Environmental factors',
  },
  {
    nameOfDisease: 'Genetic non-syndromic obesity',
    manageable: 'Uncontrollable',
    possibleCause: 'MC4R gene mutation, LEPR gene mutation, POMC gene mutation',
  },
  {
    nameOfDisease: 'Viral hemorrhagic fever',
    manageable: 'Uncontrollable',
    possibleCause: 'Ebola virus, Marburg virus, Lassa virus and so on',
  },
  {
    nameOfDisease: 'Congenital limb malformation',
    manageable: 'Uncontrollable',
    possibleCause: 'Genetic factors, environmental factors, drug effects',
  },
  {
    nameOfDisease: 'Young adult-onset distal hereditary motor neuropathy',
    manageable: 'Uncontrollable',
    possibleCause: 'HSPB1HSPB8BSCL2 and other gene mutations',
  },
  {
    nameOfDisease: 'Primary melanoma of the central nervous system',
    manageable: 'Uncontrollable',
    possibleCause: 'Genetic mutation environmental factors',
  },
  {
    nameOfDisease: 'Sagliker syndrome',
    manageable: 'Uncontrollable',
    possibleCause: 'Secondary hyperparathyroidism in chronic kidney disease',
  },
  {
    nameOfDisease: 'Pontocerebellar hypoplasia type 1',
    manageable: 'Uncontrollable',
    possibleCause: 'Genetic mutation TSEN54 gene mutation',
  },
  {
    nameOfDisease: 'Urachal diverticulum',
    manageable: 'Manageable',
    possibleCause: 'Embryonal dysplasia urachus not fully closed',
  },
  {
    nameOfDisease: 'Denys-Drash syndrome',
    manageable: 'Uncontrollable',
    possibleCause: 'WT1 gene mutation',
  },
  {
    nameOfDisease: 'Pseudoxanthoma elasticum-like papillary dermal elastolysis',
    manageable: 'Uncontrollable',
    possibleCause: 'Genetic factors UV exposure',
  },
  {
    nameOfDisease: 'Iniencephaly',
    manageable: 'Uncontrollable',
    possibleCause: 'Genetic factors Environmental factors',
  },
  {
    nameOfDisease: 'Argininemia',
    manageable: 'Manageable',
    possibleCause: 'ARG1 gene mutation results in arginase deficiency',
  },
  {
    nameOfDisease: 'Menstrual cycle-dependent periodic fever',
    manageable: 'Manageable',
    possibleCause: 'Fluctuating hormone levels endometriosis',
  },
  {
    nameOfDisease: 'Idiopathic recurrent pericarditis',
    manageable: 'Manageable',
    possibleCause: 'Autoimmune response to viral infection',
  },
  {
    nameOfDisease: 'Thyrotoxic periodic paralysis',
    manageable: 'Manageable',
    possibleCause: 'Hyperthyroid hypokalemia',
  },
  {
    nameOfDisease: 'Cor triatriatum dexter',
    manageable: 'Manageable',
    possibleCause: 'Abnormal heart development during the embryonic period',
  },
  {
    nameOfDisease: 'Upper limb defect-eye and ear abnormalities syndrome',
    manageable: 'Uncontrollable',
    possibleCause: 'Genetic mutations',
  },
  {
    nameOfDisease: 'Marinesco-Sj gren syndrome',
    manageable: 'Uncontrollable',
    possibleCause: 'SIL1 gene mutation',
  },
  {
    nameOfDisease: 'MAN1B1-CDG',
    manageable: 'Uncontrollable',
    possibleCause: 'Genetic mutation MAN1B1 gene mutation',
  },
  {
    nameOfDisease: 'Autoimmune interstitial lung disease-arthritis syndrome',
    manageable: 'Uncontrollable',
    possibleCause: 'Autoimmune abnormalities, environmental factors, genetic susceptibility',
  },
  {
    nameOfDisease: 'Emery-Nelson syndrome',
    manageable: 'Uncontrollable',
    possibleCause: 'Genetic mutations',
  },
  {
    nameOfDisease: 'Cerebrotendinous xanthomatosis',
    manageable: 'Manageable',
    possibleCause: 'Mutations in the CYP27A1 gene',
  },
  {
    nameOfDisease: 'Spontaneous intracranial hypotension',
    manageable: 'Manageable',
    possibleCause: 'Cerebrospinal fluid leak dural tear',
  },
  {
    nameOfDisease: 'SLC39A8-CDG',
    manageable: 'Uncontrollable',
    possibleCause: 'SLC39A8 gene mutation',
  },
  {
    nameOfDisease: 'Metachromatic leukodystrophy, juvenile form',
    manageable: 'Uncontrollable',
    possibleCause: 'ARSA gene mutations lead to arylsulfatase A deficiency',
  },
  {
    nameOfDisease: 'Ring chromosome 21 syndrome',
    manageable: 'Uncontrollable',
    possibleCause: 'Chromosome 21 has a ring structure',
  },
  {
    nameOfDisease: 'X-linked central congenital hypothyroidism with late-onset testicular enlargement',
    manageable: 'Uncontrollable',
    possibleCause: 'Caused by X chromosome gene mutation',
  },
  {
    nameOfDisease: 'Distal duplication 20q',
    manageable: 'Uncontrollable',
    possibleCause: 'Genetic mutation distal duplication of the long arm of chromosome 20',
  },
  {
    nameOfDisease: 'Multiple system atrophy',
    manageable: 'Uncontrollable',
    possibleCause: 'Unknown possible involvement of α-synuclein abnormalities',
  },
  {
    nameOfDisease: 'Isolated Pierre Robin sequence',
    manageable: 'Manageable',
    possibleCause: 'Genetic factors Lower jaw dysplasia',
  },
  {
    nameOfDisease: 'Combined immunodeficiency due to CD27 deficiency',
    manageable: 'Uncontrollable',
    possibleCause: 'CD27 gene mutation',
  },
  {
    nameOfDisease: 'Pituitary deficiency due to Rathke cleft cysts',
    manageable: 'Manageable',
    possibleCause: 'Rathke cleft cysts compress the pituitary gland',
  },
  {
    nameOfDisease: 'Gaucher disease type 3',
    manageable: 'Uncontrollable',
    possibleCause: 'Mutations in the GBA gene cause glucoencephalosidase deficiency',
  },
  {
    nameOfDisease: 'Lethal omphalocele-cleft palate syndrome',
    manageable: 'Uncontrollable',
    possibleCause: 'Genetic factors Chromosomal abnormalities',
  },
  {
    nameOfDisease: 'Dysequilibrium syndrome',
    manageable: 'Uncontrollable',
    possibleCause: 'Genetic mutations',
  },
];

function capitalizeFirstLetter(str: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const curableDiseasesColumns: ColumnDef<DataType>[] = [
  {
    accessorKey: 'names',
    header: 'Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'curable',
    header: 'Curable?',
    cell: (info) => capitalizeFirstLetter(info.getValue() as string),
  },
  {
    accessorKey: 'introduction',
    header: 'Introduction',
    cell: (info) => info.getValue(),
  },
];

const manageableDiseasesColumns: ColumnDef<DataType>[] = [
  {
    accessorKey: 'nameOfDisease',
    header: 'Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'manageable',
    header: 'Manageable?',
    cell: (info) => capitalizeFirstLetter(info.getValue() as string),
  },
  {
    accessorKey: 'possibleCause',
    header: 'Possible cause',
    cell: (info) => info.getValue(),
  },
];

export const diseaseManagementStatusItems: DiseaseManagementStatusItemType[] = [
  {
    img: '/imgs/particle/spectrum/09.png',
    title: 'How Many Diseases Are Curable?',
    counts: [801, 669],
    data: curableData,
    columns: curableDiseasesColumns,
    pdf: 'https://cdn.id.life/curable_disease_survey.csv',
  },
  {
    img: '/imgs/particle/spectrum/10.png',
    title: 'How Many Rare Diseases Are Manageable?',
    counts: [1333, 5332],
    data: manageableData,
    columns: manageableDiseasesColumns,
    pdf: 'https://cdn.id.life/manageable_rare_disease_survey.csv',
  },
];
