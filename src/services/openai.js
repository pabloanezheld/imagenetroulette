/**
 * Service to capture frames from the webcam and query OpenAI's Vision model.
 * Educational configurations:
 * 1. Contextual: Factual physical description including apparent gender (man/woman), hair, clothing, setting.
 * 2. ImageNet: Combines physical traits with ImageNet/WordNet personality archetypes and roles (e.g., "young man with curly hair smiling at camera, doctor, dilettante").
 * 3. Minimal: 1-2 words raw object/subject detector.
 */

export const PROMPT_PRESETS = [
  {
    id: 'contextual',
    name: {
      en: 'Contextual (Factual Scene)',
      es: 'Contextual (Escena Fáctica)',
    },
    description: {
      en: 'Objective physical description identifying apparent gender (man/woman), hair, clothing, and setting.',
      es: 'Descripción física objetiva identificando género aparente (hombre/mujer), cabello, ropa y entorno.',
    },
    systemPrompt: {
      en: `You are an objective computer vision logging system.
Provide an accurate, factual physical description of the person and scene in front of the camera.

Rules:
1. Identify physical observable facts: apparent gender (e.g. "man", "woman", "young man", "young woman"), hair color/style, clothing color/type, eyewear, posture, and room setting.
2. It is completely appropriate and expected to assign apparent gender (e.g. "man", "woman") rather than abstract terms like "individual".
3. Avoid subjective emotional or flattering adjectives (do not use "handsome", "beautiful", "charming").
4. Keep the description to 1 clean, informative sentence (strictly 15 to 25 words).

Return strict JSON:
{
  "label": "Physical Summary (e.g. 'Man with Glasses', 'Woman in Black Shirt')",
  "description": "e.g. 'A young man with curly hair wearing glasses and a dark shirt looking directly at the camera in a room.'",
  "synset": "n10000000: human",
  "confidence": 0.96,
  "tags": ["man", "glasses", "indoor", "dark-shirt"],
  "reasoning": "Detected human facial landmarks, masculine facial structure, eyeglasses, and dark textile contours.",
  "box": { "x": 20, "y": 15, "width": 60, "height": 70 }
}`,
      es: `Eres un sistema de registro de visión por computadora objetivo.
Proporciona una descripción física fáctica y precisa de la persona y escena visible frente a la cámara.

Reglas:
1. Identifica hechos físicos observables: género aparente (ej. "hombre", "mujer", "hombre joven", "mujer joven"), color/estilo de cabello, color/tipo de ropa, lentes, postura y entorno.
2. Es totalmente apropiado y esperado asignar el género aparente (ej. "hombre", "mujer") en lugar de términos abstractos como "individuo".
3. Evita adjetivos emocionales o halagadores (no uses "atractivo", "hermoso", "encantador").
4. Mantén la descripción en 1 sola oración clara e informativa (estrictamente de 15 a 25 palabras).

Devuelve JSON estricto:
{
  "label": "Resumen Físico (ej. 'Hombre con Lentes', 'Mujer con Camisa Negra')",
  "description": "ej. 'Un hombre joven de cabello rizado con lentes y camisa oscura mirando directamente a la cámara en una habitación.'",
  "synset": "n10000000: humano",
  "confidence": 0.96,
  "tags": ["hombre", "lentes", "interior", "camisa-oscura"],
  "reasoning": "Detección de puntos de referencia faciales, estructura masculina, anteojos y límites textiles.",
  "box": { "x": 20, "y": 15, "width": 60, "height": 70 }
}`
    }
  },
  {
    id: 'imagenet',
    name: {
      en: 'ImageNet Roulette (Archetypes & Roles)',
      es: 'ImageNet Roulette (Arquetipos y Roles)',
    },
    description: {
      en: 'Emulates ImageNet Roulette: combines physical appearance with 1-3 WordNet personality archetypes, professions, and social roles.',
      es: 'Emula ImageNet Roulette: combina la apariencia física con 1-3 arquetipos de personalidad, profesiones y roles de WordNet.',
    },
    systemPrompt: {
      en: `You are an educational simulation of Trevor Paglen and Kate Crawford's 'ImageNet Roulette'.
ImageNet's historical Person category assigned reductive labels, professions, and personality archetypes to human faces.

Rules:
1. "description": You MUST combine the subject's visible physical appearance (apparent gender, age group, hair, smile/expression) with 1 to 3 WordNet personality archetypes, social roles, or professions.
   - Format: "<physical appearance traits and action>, <archetype 1>, <archetype 2>"
   - Exact style example: "Young man with curly hair smiling at camera, doctor, dilettante"
   - Another example: "Woman with dark glasses looking attentively, academic, researcher"
   - If holding an object: "Man holding an apple, nutritionist, pragmatist"
2. "label": The primary assigned archetype or profession (e.g. "Doctor / Dilettante", "Scholar / Skeptic", "Academic").
3. "synset": A fitting WordNet code and title (e.g. "n10587840: academic", "n10023039: dilettante").
4. "reasoning": Explain to students the visual cues (smile, hair, posture) that the algorithm mapped to these archetypes.

Return strict JSON:
{
  "label": "Doctor / Dilettante",
  "description": "Young man with curly hair smiling at camera, doctor, dilettante",
  "synset": "n10023039: dilettante",
  "confidence": 0.92,
  "tags": ["curly-hair", "smiling", "doctor", "dilettante"],
  "reasoning": "Facial geometry, upward mouth curl, and casual posture classified into WordNet social categories.",
  "box": { "x": 25, "y": 20, "width": 50, "height": 60 }
}`,
      es: `Eres una simulación educativa de 'ImageNet Roulette' de Trevor Paglen y Kate Crawford.
La histórica categoría Persona de ImageNet asignaba etiquetas reduccionistas, profesiones y arquetipos de personalidad a los rostros humanos.

Reglas:
1. "description": DEBES combinar la apariencia física visible del sujeto (género aparente, edad, cabello, sonrisa/expresión) con 1 a 3 arquetipos de personalidad, roles sociales o profesiones de WordNet.
   - Formato: "<rasgos físicos visibles y acción>, <arquetipo 1>, <arquetipo 2>"
   - Ejemplo exacto: "Hombre joven de cabello rizado sonriendo a la cámara, médico, diletante"
   - Otro ejemplo: "Mujer con lentes oscuros mirando atentamente, académica, investigadora"
   - Si sostiene un objeto: "Hombre sosteniendo una manzana, nutricionista, pragmático"
2. "label": El arquetipo principal o profesión asignada (ej. "Médico / Diletante", "Académico / Escéptico").
3. "synset": Código y título de WordNet (ej. "n10587840: académico", "n10023039: diletante").
4. "reasoning": Explica a los estudiantes las pistas visuales (sonrisa, cabello, postura) que el algoritmo mapeó a estos arquetipos.

Devuelve JSON estricto:
{
  "label": "Médico / Diletante",
  "description": "Hombre joven de cabello rizado sonriendo a la cámara, médico, diletante",
  "synset": "n10023039: diletante",
  "confidence": 0.92,
  "tags": ["cabello-rizado", "sonriendo", "médico", "diletante"],
  "reasoning": "Geometría facial, curvatura bucal y postura informal clasificados en categorías sociales de WordNet.",
  "box": { "x": 25, "y": 20, "width": 50, "height": 60 }
}`
    }
  },
  {
    id: 'concise',
    name: {
      en: 'Strict Minimal (1-2 Words)',
      es: 'Estricto Mínimo (1-2 Palabras)',
    },
    description: {
      en: 'Raw object detection tag: exactly 1 to 2 words only. Zero conversational sentences.',
      es: 'Etiqueta directa de detección de objetos: exactamente 1 o 2 palabras. Cero oraciones.',
    },
    systemPrompt: {
      en: `You are an ultra-fast raw object detection engine (like YOLO or MobileNet).
CRITICAL RULE: YOU MUST RETURN NO SENTENCES, NO PROSE, NO ADJECTIVES, NO FILLER WORDS.

1. "label": Exactly 1 or 2 words naming the primary foreground item.
   - If holding an apple: "Apple"
   - If holding a pen: "Pen"
   - If holding a phone: "Smartphone"
   - If just a person: "Man" or "Woman" or "Face"
2. "description": MUST BE IDENTICAL to the label (exactly 1 or 2 words, e.g. "Apple" or "Man"). DO NOT WRITE A SENTENCE.
3. "tags": 2 simple category tags.

Return strict JSON:
{
  "label": "Apple",
  "description": "Apple",
  "synset": "n07739125",
  "confidence": 0.99,
  "tags": ["fruit", "food"],
  "reasoning": "Direct object segmentation.",
  "box": { "x": 35, "y": 30, "width": 30, "height": 40 }
}`,
      es: `Eres un motor de detección de objetos sin procesar ultrarrápido (estilo YOLO o MobileNet).
REGLA CRÍTICA: NO DEVUELVAS ORACIONES, NI PROSA, NI ADJETIVOS, NI PALABRAS DE RELLENO.

1. "label": Exactamente 1 o 2 palabras nombrando el objeto principal en primer plano.
   - Si sostienes una manzana: "Manzana"
   - Si sostienes un bolígrafo: "Bolígrafo"
   - Si sostienes un teléfono: "Teléfono"
   - Si solo es una persona: "Hombre" o "Mujer" o "Rostro"
2. "description": DEBE SER IDÉNTICO a la etiqueta (exactamente 1 o 2 palabras, ej. "Manzana" o "Hombre"). NO ESCRIBAS UNA ORACIÓN.
3. "tags": 2 etiquetas simples de categoría.

Devuelve JSON estricto:
{
  "label": "Manzana",
  "description": "Manzana",
  "synset": "n07739125",
  "confidence": 0.99,
  "tags": ["fruta", "comida"],
  "reasoning": "Segmentación directa de objeto.",
  "box": { "x": 35, "y": 30, "width": 30, "height": 40 }
}`
    }
  }
];

/**
 * Capture an optimized JPEG image from a video element
 */
export function captureFrameAsBase64(videoElement, targetWidth = 640) {
  if (!videoElement || videoElement.videoWidth === 0) {
    throw new Error('Video stream is not ready or not active.');
  }

  const canvas = document.createElement('canvas');
  const aspectRatio = videoElement.videoHeight / videoElement.videoWidth;
  canvas.width = targetWidth;
  canvas.height = Math.round(targetWidth * aspectRatio);

  const ctx = canvas.getContext('2d');
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL('image/jpeg', 0.82);
}

/**
 * Call OpenAI Chat Completions API with Vision
 */
export async function analyzeImageWithOpenAI({
  imageDataUrl,
  apiKey,
  model = 'gpt-4o-mini',
  presetId = 'contextual',
  language = 'en',
  customPrompt = null,
}) {
  if (!apiKey || !apiKey.trim()) {
    throw new Error(language === 'es' ? 'Por favor introduce una clave API de OpenAI en los ajustes.' : 'Please enter a valid OpenAI API key in the settings.');
  }

  const selectedPreset = PROMPT_PRESETS.find(p => p.id === presetId) || PROMPT_PRESETS[0];
  const langKey = language === 'es' ? 'es' : 'en';
  const systemPrompt = customPrompt || selectedPreset.systemPrompt[langKey] || selectedPreset.systemPrompt.en;

  let userInstruction = '';
  if (language === 'es') {
    if (presetId === 'concise') {
      userInstruction = 'Detecta el elemento principal. Devuelve EXACTAMENTE 1 o 2 palabras en español para label y description. Cero oraciones.';
    } else if (presetId === 'imagenet') {
      userInstruction = 'Analiza la imagen al estilo ImageNet Roulette. Devuelve la descripción combinando apariencia física concreta (hombre/mujer, edad, cabello, expresión) con 1 a 3 arquetipos de personalidad y profesiones. Ejemplo: "Hombre joven de cabello rizado sonriendo a la cámara, médico, diletante".';
    } else {
      userInstruction = 'Describe objetivamente los hechos físicos visibles indicando género aparente (hombre/mujer), cabello, ropa y entorno en una oración clara y fáctica en español.';
    }
  } else {
    if (presetId === 'concise') {
      userInstruction = 'Detect the primary subject. Return EXACTLY 1 or 2 words for label and description. Zero sentences.';
    } else if (presetId === 'imagenet') {
      userInstruction = 'Analyze the image in the exact style of ImageNet Roulette. Return the description by combining concrete physical appearance (man/woman, age, hair, expression) with 1 to 3 personality archetypes and professions. Example: "Young man with curly hair smiling at camera, doctor, dilettante".';
    } else {
      userInstruction = 'Objectively describe the visible physical facts indicating apparent gender (man/woman), hair, clothing, and setting in a clear, factual sentence.';
    }
  }

  const startTime = performance.now();

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      model: model || 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: userInstruction,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageDataUrl,
                detail: 'low',
              },
            },
          ],
        },
      ],
      max_tokens: 350,
      temperature: presetId === 'concise' ? 0.0 : 0.3,
    }),
  });

  const latencyMs = Math.round(performance.now() - startTime);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error?.message || `API error (${response.status}: ${response.statusText})`;
    throw new Error(message);
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content || '{}';

  let parsed = {};
  try {
    parsed = JSON.parse(rawContent);
  } catch (err) {
    console.error('Failed to parse model JSON:', rawContent, err);
    parsed = {
      label: language === 'es' ? 'Detección' : 'Detection',
      description: rawContent.slice(0, 100),
      confidence: 0.9,
      tags: ['detection'],
      reasoning: 'Parsed as unstructured response.',
      box: { x: 25, y: 20, width: 50, height: 60 }
    };
  }

  const box = {
    x: Math.max(5, Math.min(80, parsed.box?.x ?? 25)),
    y: Math.max(5, Math.min(80, parsed.box?.y ?? 20)),
    width: Math.max(15, Math.min(90, parsed.box?.width ?? 50)),
    height: Math.max(15, Math.min(90, parsed.box?.height ?? 60)),
  };

  return {
    label: parsed.label || (language === 'es' ? 'Sujeto Identificado' : 'Identified Subject'),
    description: parsed.description || (language === 'es' ? 'Sujeto reconocido en la cámara.' : 'Subject recognized in camera view.'),
    synset: parsed.synset || 'n00000000: visual-entity',
    confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.95,
    tags: Array.isArray(parsed.tags) ? parsed.tags : ['visual', 'webcam'],
    reasoning: parsed.reasoning || (language === 'es' ? 'Vectores de características visuales identificados.' : 'Visual feature vectors identified.'),
    box,
    telemetry: {
      latencyMs,
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0,
      model: data.model || model,
      presetId,
      language,
      timestamp: new Date().toISOString(),
      rawResponse: data,
    },
  };
}
