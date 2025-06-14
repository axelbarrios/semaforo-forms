import { Question } from './types';

export const questions: Question[] = [
  // CONSENSO
  { id: 1, text: 'Constantemente Permito groserías y malos tratos de mi pareja', factor: 'CONSENSO', scoring: 'reverse' },
  { id: 2, text: 'Evito expresar mi propia opinión cuando ésta es diferente a la de mi pareja', factor: 'CONSENSO', scoring: 'reverse' },
  { id: 3, text: 'Para evitarme problemas es mejor no decir lo que me molesta', factor: 'CONSENSO', scoring: 'reverse' },
  { id: 4, text: 'Pongo a un lado mis valores y convicciones por aceptar los de mi pareja', factor: 'CONSENSO', scoring: 'reverse' },
  { id: 5, text: 'Tomamos decisiones juntos en pareja cuando atravesamos tiempos difíciles', factor: 'CONSENSO', scoring: 'normal' },
  { id: 6, text: 'En lugar de lo que yo deseo, termino haciendo lo que desea mi pareja', factor: 'CONSENSO', scoring: 'reverse' },
  { id: 7, text: 'Me resulta difícil tomar decisiones en pareja', factor: 'CONSENSO', scoring: 'reverse' },
  { id: 8, text: 'Tengo control de mis palabras y No permito que mi lengua me controle', factor: 'CONSENSO', scoring: 'normal' },
  { id: 9, text: 'En mi casa se manejan sabiamente las finanzas', factor: 'CONSENSO', scoring: 'normal' },
  { id: 10, text: 'En mi relación de pareja cada quien maneja su dinero', factor: 'CONSENSO', scoring: 'reverse' },
  { id: 11, text: 'Ambos miembros de la pareja tenemos metas y objetivos comunes para el futuro.', factor: 'CONSENSO', scoring: 'normal' },
  { id: 12, text: 'Nos consultamos mutuamente antes de hacer gastos importantes.', factor: 'CONSENSO', scoring: 'normal' },
  { id: 13, text: 'Estamos de acuerdo en cómo criamos a los hijos y establecemos límites', factor: 'CONSENSO', scoring: 'normal' },
  { id: 14, text: 'Tomamos decisiones financieras importantes, como inversiones, de manera conjunta.', factor: 'CONSENSO', scoring: 'normal' },
  { id: 15, text: 'Nos apoyamos mutuamente en proyectos y actividades personales externas al matrimonio', factor: 'CONSENSO', scoring: 'normal' },
  
  // SATISFACCION
  { id: 16, text: 'Compartimos una visión similar sobre el manejo del estrés y los conflictos', factor: 'SATISFACCION', scoring: 'normal' },
  { id: 17, text: 'Nos sentimos satisfechos con los acuerdos y compromisos que hemos establecido en nuestra relación de pareja.', factor: 'SATISFACCION', scoring: 'normal' },
  { id: 18, text: 'Siento que complazco a mi pareja antes de centrarme en mi mismo/a', factor: 'SATISFACCION', scoring: 'normal' },
  { id: 19, text: 'Aparento ser feliz, aunque me sienta mal', factor: 'SATISFACCION', scoring: 'reverse' },
  { id: 20, text: 'Sé exactamente lo que espero de mi pareja.', factor: 'SATISFACCION', scoring: 'normal' },
  { id: 21, text: 'Soy de las personas que aparenta que todo marcha bien en la relación, cuando realmente no es así', factor: 'SATISFACCION', scoring: 'reverse' },
  { id: 22, text: 'En general, me siento satisfecho/a con la comunicación en mi relación', factor: 'SATISFACCION', scoring: 'normal' },
  { id: 23, text: 'Siento que mi pareja me comprende y escucha mis necesidades emocionales.', factor: 'SATISFACCION', scoring: 'normal' },
  { id: 24, text: 'Como pareja, disfrutamos de actividades compartidas y momentos de diversión juntos.', factor: 'SATISFACCION', scoring: 'normal' },
  { id: 25, text: 'En mi relación puedo expresar libremente mis deseos y opiniones sin temor a repercusiones negativas.', factor: 'SATISFACCION', scoring: 'normal' },
  { id: 26, text: 'Siento que mi pareja me apoya en mis metas y aspiraciones personales.', factor: 'SATISFACCION', scoring: 'normal' },
  { id: 27, text: 'Nuestro nivel de intimidad y conexión emocional es satisfactorio para mí.', factor: 'SATISFACCION', scoring: 'normal' },
  { id: 28, text: 'Me siento valorado/a y respetado/a en mi relación.', factor: 'SATISFACCION', scoring: 'normal' },
  { id: 29, text: 'En general, me siento satisfecho/a con la calidad de nuestra vida en pareja.', factor: 'SATISFACCION', scoring: 'normal' },
  { id: 30, text: 'En mi relación hay más problemas que satisfacciones.', factor: 'SATISFACCION', scoring: 'reverse' },
  
  // COHESION
  { id: 31, text: 'Cuando surge un desacuerdo, generalmente soy yo quien cede', factor: 'COHESION', scoring: 'reverse' },
  { id: 32, text: 'Tengo intereses en común con mi pareja', factor: 'COHESION', scoring: 'normal' },
  { id: 33, text: 'En los tiempos libres, casi nunca hacemos algo juntos', factor: 'COHESION', scoring: 'reverse' },
  { id: 34, text: 'Regularmente con mi pareja asistimos juntos a la iglesia', factor: 'COHESION', scoring: 'normal' },
  { id: 35, text: 'Mi pareja y yo profesamos la misma religión', factor: 'COHESION', scoring: 'normal' },
  { id: 36, text: 'Con mi pareja realizamos a menudo actividades o pasatiempos juntos', factor: 'COHESION', scoring: 'normal' },
  { id: 37, text: 'Creo que tenemos en pareja conversaciones profundas y significativas con frecuencia', factor: 'COHESION', scoring: 'normal' },
  { id: 38, text: 'Creo que existe una buena comunicación emocional entre mi pareja y yo', factor: 'COHESION', scoring: 'normal' },
  { id: 39, text: 'Regularmente Pasamos tiempo juntos sin distracciones', factor: 'COHESION', scoring: 'normal' },
  { id: 40, text: 'Siento respeto a la intimidad sexual en mi relación.', factor: 'COHESION', scoring: 'normal' },
  { id: 41, text: 'Como pareja nos apoyamos mutuamente en nuestras metas, sueños y responsabilidades', factor: 'COHESION', scoring: 'normal' },
  { id: 42, text: 'En casa resolvemos los conflictos de manera constructiva y llegamos a acuerdos satisfactorios.', factor: 'COHESION', scoring: 'normal' },
  { id: 43, text: 'Siempre valoro las fortalezas y cualidades positivas de mi pareja.', factor: 'COHESION', scoring: 'normal' },
  { id: 44, text: 'Reconozco cuando tengo la culpa.', factor: 'COHESION', scoring: 'normal' },
  { id: 45, text: 'Siento que ya no tengo interés en trabajar en la relación de pareja.', factor: 'COHESION', scoring: 'reverse' },
  
  // EXPRESION DE AFECTO
  { id: 46, text: 'Cuando necesito soporte y amor en alguna situación, lo recibo de mi pareja.', factor: 'EXPRESION DE AFECTO', scoring: 'normal' },
  { id: 47, text: 'He compartido recientemente un logro con mi pareja.', factor: 'EXPRESION DE AFECTO', scoring: 'normal' },
  { id: 48, text: 'He experimentado de la gracia de Dios en mi relación de pareja.', factor: 'EXPRESION DE AFECTO', scoring: 'normal' },
  { id: 49, text: 'Regularmente evito expresar mis sentimientos por temor a ser criticado/a.', factor: 'EXPRESION DE AFECTO', scoring: 'reverse' },
  { id: 50, text: 'Evito enojarme por temor a perder el control.', factor: 'EXPRESION DE AFECTO', scoring: 'reverse' },
  { id: 51, text: 'Me es fácil decirle "te amo" a mi pareja', factor: 'EXPRESION DE AFECTO', scoring: 'normal' },
  { id: 52, text: 'Alguna vez he deseado no haberse casado', factor: 'EXPRESION DE AFECTO', scoring: 'reverse' },
  { id: 53, text: 'Nos expresamos afecto físico regularmente, como abrazos, besos o caricias.', factor: 'EXPRESION DE AFECTO', scoring: 'normal' },
  { id: 54, text: 'Puedo hablar abiertamente sobre mis necesidades emocionales sin temor a juicio o crítica.', factor: 'EXPRESION DE AFECTO', scoring: 'normal' },
  { id: 55, text: 'Practico la escucha activa cuando mi pareja comparte sus preocupaciones o problemas.', factor: 'EXPRESION DE AFECTO', scoring: 'normal' },
  { id: 56, text: 'Enfrentamos los desafíos juntos como equipo, apoyándonos mutuamente en todo momento.', factor: 'EXPRESION DE AFECTO', scoring: 'normal' },
  { id: 57, text: 'Expresamos gratitud y aprecio el uno hacia el otro de manera regular.', factor: 'EXPRESION DE AFECTO', scoring: 'normal' },
  { id: 58, text: 'Mantenemos una comunicación clara y abierta sobre nuestras expectativas y metas en la relación.', factor: 'EXPRESION DE AFECTO', scoring: 'normal' },
  { id: 59, text: 'Nos esforzamos por mantener una atmósfera de confianza y seguridad en nuestra relación.', factor: 'EXPRESION DE AFECTO', scoring: 'normal' },
  { id: 60, text: 'Regularmente tomamos un tiempo para orar juntos', factor: 'EXPRESION DE AFECTO', scoring: 'normal' },
  
  // CONEXION SEXUAL
  { id: 61, text: 'Las relaciones sexuales con mi pareja son satisfactorias.', factor: 'CONEXION SEXUAL', scoring: 'normal' },
  { id: 62, text: 'Tener sexo con mi pareja es muy importante en mi vida.', factor: 'CONEXION SEXUAL', scoring: 'normal' },
  { id: 63, text: 'Siento que en mis relaciones sexuales hay monotonía.', factor: 'CONEXION SEXUAL', scoring: 'reverse' },
  { id: 64, text: 'Veo a mi pareja sexualmente atractiva.', factor: 'CONEXION SEXUAL', scoring: 'normal' },
  { id: 65, text: 'Siento vergüenza al expresar mis deseos sexuales.', factor: 'CONEXION SEXUAL', scoring: 'reverse' },
  { id: 66, text: 'Siento que mi deseo sexual ha disminuido.', factor: 'CONEXION SEXUAL', scoring: 'reverse' },
  { id: 67, text: 'Siento amor cuando Tengo relaciones sexuales con mi pareja.', factor: 'CONEXION SEXUAL', scoring: 'normal' },
  { id: 68, text: 'Acepto tener relaciones sexuales, aunque no lo desee, por no enojar a mi pareja.', factor: 'CONEXION SEXUAL', scoring: 'reverse' },
  { id: 69, text: 'Mi pareja me ha hablado sobre sus fantasías sexuales.', factor: 'CONEXION SEXUAL', scoring: 'normal' },
  { id: 70, text: 'Me gusta la frecuencia con la que tengo relaciones sexuales con mi pareja.', factor: 'CONEXION SEXUAL', scoring: 'normal' },
  { id: 71, text: 'Hay diversión en nuestros encuentros sexuales.', factor: 'CONEXION SEXUAL', scoring: 'normal' },
  { id: 72, text: 'En mis relaciones sexuales no hay distracciones.', factor: 'CONEXION SEXUAL', scoring: 'normal' },
  { id: 73, text: 'Me siento atractiva/o sexualmente para mi pareja.', factor: 'CONEXION SEXUAL', scoring: 'normal' },
  { id: 74, text: 'Procuro estar presentable antes de tener relaciones sexuales con mi pareja.', factor: 'CONEXION SEXUAL', scoring: 'normal' },
  { id: 75, text: 'En mi relación existe un problema médico que me impide tener relaciones sexuales.', factor: 'CONEXION SEXUAL', scoring: 'reverse' },
];