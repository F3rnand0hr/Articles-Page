-- Insert sample articles (these will be created by system user, adjust as needed)
INSERT INTO public.articles (title, content, excerpt, author_id, category, featured) VALUES
(
  'Introducción al Derecho Constitucional',
  'El derecho constitucional es la rama del derecho público que estudia las normas que rigen la organización del Estado, los poderes públicos y los derechos fundamentales de los ciudadanos. En este artículo exploraremos los principios básicos que sustentan nuestro sistema constitucional y su importancia en la protección de los derechos humanos.',
  'Una introducción completa a los fundamentos del derecho constitucional y su importancia en la protección de derechos.',
  '00000000-0000-0000-0000-000000000000',
  'constitucional',
  true
),
(
  'Principios del Derecho Penal',
  'El derecho penal se fundamenta en principios básicos que garantizan la justicia y protegen tanto a la sociedad como a los individuos. Entre estos principios encontramos la legalidad, la culpabilidad, la proporcionalidad y la humanidad de las penas. Cada uno de estos principios cumple una función específica en el sistema de justicia penal.',
  'Análisis de los principios fundamentales que rigen el derecho penal moderno.',
  '00000000-0000-0000-0000-000000000000',
  'penal',
  true
),
(
  'Contratos en el Derecho Civil',
  'Los contratos son acuerdos de voluntades que crean obligaciones entre las partes. En el derecho civil, los contratos deben cumplir con ciertos requisitos para ser válidos: consentimiento, objeto, causa y forma cuando la ley lo exige. Este artículo examina los diferentes tipos de contratos y sus características principales.',
  'Guía completa sobre los contratos civiles, sus requisitos y clasificaciones.',
  '00000000-0000-0000-0000-000000000000',
  'civil',
  false
);
