import { GoogleGenAI, Type } from '@google/genai';
import { NextResponse } from 'next/server';

import { SKILL_CREATOR_GUIDELINES } from '@/lib/skill-guidelines';

type ModelType = 'ultra-fast' | 'super-agent';
type SelectedTool = 'prompt' | 'design' | 'skill' | 'spec';

function generationInstructions(selectedTool: SelectedTool, modelType: ModelType) {
  let systemInstruction = '';
  let promptDescription = '';

  if (selectedTool === 'prompt') {
    systemInstruction = `You are a senior AI agent prompt architect for coding tools, design agents, and product builders.
Your task is to take a basic user prompt for an app or website and turn it into a powerful execution prompt that an autonomous agent can follow end to end.

Requirements for the generated prompt:
1. Start with a clear role, mission, and success criteria for the receiving agent.
2. Instruct the agent to inspect the existing project, read available instructions/skills/docs before implementing, and reuse existing patterns instead of inventing unrelated architecture.
3. It MUST explicitly specify exact spacing (using Tailwind scales like p-4, m-8), layout structures, theme colors (hex codes or Tailwind palette), features, typography and vibe.
4. It MUST explicitly BAN glows, gradients, and shadows unless the user explicitly asks for them. Add clear instructions like "Do not use glows", "No gradients", "Strictly no drop shadows or box shadows".
5. Use a brutalist, clean, flat, or minimal solid aesthetic approach by default, unless the user specifies a different vibe.
6. Include detailed instructions for interactive states, accessibility, responsive behavior, error states, loading states, and final verification steps.
7. Make the output decisive and implementation-ready, with no vague filler or generic encouragement.`;
    promptDescription = 'The advanced prompt ready to be copy-pasted.';
  } else if (selectedTool === 'design') {
    systemInstruction = `You are a senior product designer and design-systems architect. Your task is to take a basic user prompt and turn it into a powerful DESIGN.md file that an AI builder can actually implement.
        
Requirements for the generated DESIGN.md:
1. Structure it with markdown headings for product goal, audience, information architecture, screens, components, states, typography, color, spacing, motion, accessibility, and QA.
2. Tell the implementing agent to read existing project instructions, available skills, component patterns, and design tokens before building.
3. Detail exact color palette, typography choices, spacing guidelines, layout structures, responsive rules, and component behavior.
4. Include empty, loading, error, success, disabled, hover, focus, and mobile states where relevant.
5. Avoid vague visual language; make every major decision concrete enough to implement.
6. Output ONLY the markdown text.`;
    promptDescription = 'The advanced DESIGN.md file content ready to be copy-pasted.';
  } else if (selectedTool === 'skill') {
    systemInstruction = `You are an expert Codex skill author. Your task is to take a basic user prompt and turn it into a production-grade SKILL.md file that makes an AI agent more capable, more careful, and more useful. Read these guidelines carefully before generating the skill:

<skill-creator-guidelines>
${SKILL_CREATOR_GUIDELINES}
</skill-creator-guidelines>
        
Requirements for the generated SKILL.md:
1. Include YAML frontmatter with 'name' and 'description'.
2. Structure the skill instructions with clear headings that match how an agent will use the skill.
3. Explicitly instruct the agent to read relevant local files, attached docs, examples, schemas, APIs, and existing skill references before acting.
4. Include trigger rules, workflow steps, decision rules, quality bar, validation checks, failure handling, and examples when useful.
5. Make the skill operational, not motivational: every instruction should change what the agent does.
6. Output ONLY the markdown text.`;
    promptDescription = 'The advanced SKILL.md file content ready to be copy-pasted.';
  } else {
    systemInstruction = `You are a senior AI specification architect. Your task is to take a basic user request and turn it into a complete SPEC.md file: one single source of truth that combines PROMPT.md, DESIGN.md, SKILL.md, and RESEARCH.md into a professional unified specification.

SPEC.md must merge:
- PROMPT.md content: core mission, purpose, behavior, and instructions.
- DESIGN.md content: design system and visual specifications.
- SKILL.md content: skill definition, triggers, workflow, and metadata.
- RESEARCH.md content: knowledge base, assumptions, references, and research context.

Requirements for the generated SPEC.md:
1. Use the filename heading "# SPEC.md" or a clear "# <Project/Agent Name> SPEC.md" title.
2. Include these 15 sections in this order: Overview; Core Mission & Purpose; Trigger Conditions; Agent Behavior & Instructions; Design System & Visual Specs; Skill Definition & Metadata; Knowledge Base & Research; Operational Guidelines; Real-World Examples; Integration & Dependencies; Configuration & Customization; Performance & Optimization; Version History & Changelog; Complementary Agents & Skills; Support & Metadata.
3. Make it a single source of truth, not a loose collection of notes. Avoid duplicate or contradictory guidance.
4. Include concrete operational best practices, mistakes to avoid, real use cases, dependency notes, customization options, troubleshooting guidance, and metadata.
5. Make every section implementation-ready for an AI agent or developer to act on.
6. Output ONLY the markdown text.`;
    promptDescription = 'The unified SPEC.md file content ready to be copy-pasted.';
  }

  return { systemInstruction, promptDescription };
}

export async function POST(req: Request) {
  const body = await req.json();
  const apiKey = body.apiKey || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    return new NextResponse('Missing Gemini API key', { status: 400 });
  }

  const modelType = (body.modelType || 'ultra-fast') as ModelType;
  const ai = new GoogleGenAI({ apiKey });

  if (body.action === 'refine') {
    const response = await ai.models.generateContent({
      model: body.isVoice ? 'gemini-3.1-flash-live-preview' : (modelType !== 'ultra-fast' ? 'gemini-3-flash-preview' : 'gemini-3.1-flash-lite'),
      contents: [
        { role: 'user', parts: [{ text: `Here is the current prompt I am generating:\n\n${body.result}\n\nPlease update it according to this instruction: ${body.instruction}\n\nProvide the updated full prompt string. Do not include markdown \`\`\` blocks around your answer.` }] },
      ],
      config: body.isVoice ? {
        responseModalities: ['AUDIO' as any],
      } : {
        tools: modelType !== 'ultra-fast' ? [{ googleSearch: {} }, { urlContext: {} }, { codeExecution: {} }] : undefined,
      },
    });

    return NextResponse.json({ text: response.text || '' });
  }

  const selectedTool = (body.selectedTool || 'prompt') as SelectedTool;
  const { systemInstruction, promptDescription } = generationInstructions(selectedTool, modelType);
  const response = await ai.models.generateContent({
    model: modelType !== 'ultra-fast' ? 'gemini-3-flash-preview' : 'gemini-3.1-flash-lite',
    contents: body.contents,
    config: {
      tools: modelType !== 'ultra-fast' ? [{ googleSearch: {} }, { urlContext: {} }, { codeExecution: {} }] : undefined,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'A two or three word short title for this app idea.' },
          prompt: { type: Type.STRING, description: promptDescription },
          svg_icon: { type: Type.STRING, description: 'A functional SVG string (only the <svg> tag and contents). Use viewBox 0 0 48 48. Build a very simple geometric layout abstractly representing the app using <rect> or <circle> elements. Use exactly fill="#27272a" or clear stroke="#27272a". Never add width or height attributes to the root <svg>, only viewBox. Make it a clean flat icon.' },
        },
        required: ['title', 'prompt', 'svg_icon'],
      },
      systemInstruction,
    },
  });

  return NextResponse.json({
    text: response.text || '',
    candidates: response.candidates || [],
  });
}
