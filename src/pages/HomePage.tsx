import { useState } from 'react';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import TouchAppRoundedIcon from '@mui/icons-material/TouchAppRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import { AppShell } from '../components/layout/AppShell';
import { KanjiGlyph } from '../components/common/KanjiGlyph';
import { MexicoFlag } from '../components/common/MexicoFlag';
import { SectionCard } from '../components/common/SectionCard';
import {
  CHALLENGE_DESCRIPTIONS,
  CHALLENGE_LABELS,
  LEVELS,
  LEVEL_ORDER,
} from '../features/game/levels';
import type { ChallengeKind } from '../features/game/types';

const FEATURES = [
  {
    icon: <TouchAppRoundedIcon />,
    title: 'Arrastra y aprende',
    body: 'Cada ronda reparte al azar un kanji de la API entre las cartas. Solo una es la correcta: arrástrala a la zona de respuesta.',
  },
  {
    icon: <SchoolRoundedIcon />,
    title: 'Cinco niveles JLPT',
    body: 'De N5 a N1. El mazo crece con tu nivel y cada ronda mezcla retos de significado, lectura y palabras compuestas.',
  },
  {
    icon: <MenuBookRoundedIcon />,
    title: 'Ficha al instante',
    body: 'Respondas bien o mal, verás la ficha completa: lecturas on y kun, romaji, trazos, radical y los kanjis emparentados.',
  },
  {
    icon: <PublicRoundedIcon />,
    title: 'Pistas de verdad',
    body: 'Radical Kangxi, etimología y palabras frecuentes: datos de Wiktionary y Jisho para desbloquearte cuando te atrases.',
  },
];

const KIND_ORDER: ChallengeKind[] = ['meaning', 'glyph', 'reading', 'sibling', 'compound'];

const STATS = [
  { value: '612', label: 'kanjis traducidos' },
  { value: '5', label: 'niveles JLPT' },
  { value: '5', label: 'tipos de reto' },
  { value: '3', label: 'APIs conectadas' },
];

/** Portada de la aplicación. */
export function HomePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(LEVELS.n5);

  return (
    <AppShell>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) minmax(0, 0.85fr)' },
          gap: { xs: 5, md: 8 },
          alignItems: 'center',
          py: { xs: 2, md: 4 },
        }}
      >
        <Box>
          <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
            <Chip
              icon={<MenuBookRoundedIcon />}
              label="Datos de kanjiapi.dev"
              size="small"
              sx={{ bgcolor: 'rgba(44,74,99,0.10)', color: '#2C4A63', fontWeight: 800 }}
            />
            <Chip
              label="JLPT N5 → N1"
              size="small"
              variant="outlined"
              sx={{ fontWeight: 800, borderColor: 'divider', bgcolor: 'background.paper' }}
            />
            <Chip
              icon={<MexicoFlag size={16} />}
              label="Hecho en México"
              size="small"
              variant="outlined"
              sx={{
                fontWeight: 800,
                borderColor: 'divider',
                bgcolor: 'background.paper',
                '& .MuiChip-icon': { ml: 1, mr: -0.25 },
              }}
            />
          </Stack>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 2 }}>
            <KanjiGlyph character="漢字" size={78} sx={{ color: 'primary.main' }} />
            <Typography
              variant="h1"
              sx={{ fontSize: { xs: 46, sm: 66, lg: 76 }, lineHeight: 0.95 }}
            >
              Kanji Lab
            </Typography>
          </Box>

          <Typography
            variant="h5"
            component="p"
            color="text.secondary"
            sx={{
              maxWidth: 560,
              fontWeight: 500,
              lineHeight: 1.5,
              fontSize: { xs: 18, sm: 20 },
              mb: 4,
            }}
          >
            Aprende kanjis jugando: el enunciado te pide un carácter y tú arrastras
            la carta correcta entre un mazo generado al azar desde la API. Cada
            nivel filtra, mezcla y combina kanjis según el JLPT.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 5 }}>
            <Button
              size="large"
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={() => navigate(`/game?level=${selected.id}`)}
              sx={{ px: 4 }}
            >
              Jugar en {selected.label}
            </Button>
            <Button
              size="large"
              variant="outlined"
              onClick={() => navigate('/game')}
              sx={{ px: 4, borderColor: 'divider', bgcolor: 'background.paper' }}
            >
              Ver todos los niveles
            </Button>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
              gap: 1.5,
            }}
          >
            {STATS.map((stat) => (
              <Box
                key={stat.label}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1.6px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ── Elegir nivel ─────────────────────────────────────────────────── */}
        <SectionCard title="Elige tu nivel" subtitle="El mazo se carga de la API según el nivel">
          <Stack spacing={1.25}>
            {LEVEL_ORDER.map((id) => {
              const level = LEVELS[id];
              const active = selected.id === id;
              return (
                <Box
                  key={id}
                  component="button"
                  type="button"
                  onClick={() => setSelected(level)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    width: '100%',
                    textAlign: 'left',
                    p: 1.75,
                    borderRadius: 2,
                    border: '1.6px solid',
                    borderColor: active ? level.color : 'divider',
                    bgcolor: active ? `${level.color}0F` : 'background.paper',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'border-color 150ms ease, background-color 150ms ease',
                    '&:hover': { borderColor: level.color },
                    '&:focus-visible': { outline: '3px solid rgba(193,39,45,0.45)' },
                  }}
                >
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      flexShrink: 0,
                      borderRadius: 1.5,
                      display: 'grid',
                      placeItems: 'center',
                      bgcolor: active ? level.color : 'rgba(18,17,23,0.05)',
                      color: active ? '#fff' : 'text.secondary',
                      fontWeight: 800,
                      fontSize: 15,
                    }}
                  >
                    {level.label}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle1" sx={{ lineHeight: 1.25, fontWeight: 700 }}>
                      {level.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {level.description}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </SectionCard>
      </Box>

      {/* ── Qué aprenderás ────────────────────────────────────────────────── */}
      <Box sx={{ mt: { xs: 6, md: 10 } }}>
        <Typography variant="h2" sx={{ mb: 1 }}>
          Lo que aprenderás
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 640 }}>
          Cada partida está pensada para que aprendas algo concreto, no solo para
          acertar más.
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 2,
          }}
        >
          {FEATURES.map((feature) => (
            <Box
              key={feature.title}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1.6px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 1.5,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: 'rgba(193,39,45,0.08)',
                  color: 'primary.main',
                  mb: 2,
                  '& svg': { fontSize: 22 },
                }}
              >
                {feature.icon}
              </Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.body}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Tipos de reto ─────────────────────────────────────────────────── */}
      <Box sx={{ mt: { xs: 6, md: 10 } }}>
        <Typography variant="h2" sx={{ mb: 1 }}>
          Tipos de reto
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 640 }}>
          Se desbloquean según el nivel que elijas.
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' },
            gap: 2,
          }}
        >
          {KIND_ORDER.map((kind) => {
            const level = LEVEL_ORDER.map((id) => LEVELS[id]).find((l) =>
              l.challengeKinds.includes(kind),
            );
            return (
              <Box
                key={kind}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: '1.6px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              >
                <Chip
                  label={level?.label ?? '—'}
                  size="small"
                  sx={{
                    bgcolor: level ? `${level.color}1A` : 'rgba(18,17,23,0.06)',
                    color: level?.color ?? 'text.secondary',
                    fontWeight: 800,
                    mb: 1.5,
                  }}
                />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {CHALLENGE_LABELS[kind]}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {CHALLENGE_DESCRIPTIONS[kind]}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* ── CTA final ─────────────────────────────────────────────────────── */}
      <Box
        sx={{
          mt: { xs: 6, md: 10 },
          p: { xs: 4, md: 6 },
          borderRadius: 3,
          border: '1.6px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" sx={{ mb: 1.5 }}>
          ¿Listo para empezar?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 520, mx: 'auto' }}>
          Elige tu nivel y empieza. Las pistas, la ficha y los kanjis emparentados
          están a un clic de distancia.
        </Typography>
        <Button
          size="large"
          variant="contained"
          endIcon={<ArrowForwardRoundedIcon />}
          onClick={() => navigate(`/game?level=${selected.id}`)}
          sx={{ px: 4 }}
        >
          Jugar en {selected.label}
        </Button>
      </Box>
    </AppShell>
  );
}

export default HomePage;
