"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTeamStore } from '@/store/team-store';
import { useAppStore } from '@/store/app-store';
import { TeamShowcase } from '@/components/social/TeamShowcase';
import { TeamSharingService } from '@/lib/social/team-sharing';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Share2, QrCode, Twitter, MessageCircle, Copy } from 'lucide-react';

export default function SocialHubPage() {
  const { currentTeam } = useTeamStore();
  const { addSharedTeam, userProfile } = useAppStore();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');

  const validTeam = currentTeam.filter((p) => p !== null);
  const teamCode = TeamSharingService.generateTeamCode(currentTeam);

  const handleShare = () => {
    if (!teamName.trim() || validTeam.length === 0) {
      alert('Adicione um nome ao time e tenha pelo menos 1 Pokémon!');
      return;
    }

    const tags = TeamSharingService.getTypeTags(currentTeam);
    const sharedTeam = TeamSharingService.createSharedTeam(
      currentTeam,
      teamName,
      teamDescription,
      userProfile.name,
      userProfile.id,
      tags
    );

    addSharedTeam(sharedTeam);
    setShowShareDialog(false);
    setTeamName('');
    setTeamDescription('');
    alert('Time compartilhado com sucesso!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-10 h-10 text-purple-500" />
          <h1 className="text-4xl font-bold">Social Hub</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Compartilhe seu time e descubra estratégias da comunidade!
        </p>
      </motion.div>

      {/* Share Your Team */}
      <Card className="p-6 mb-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Compartilhe Seu Time
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Seu time atual: {validTeam.length} Pokémon
            </p>

            {validTeam.length > 0 && (
              <>
                <div className="flex gap-2 mb-3">
                  {validTeam.slice(0, 6).map((pokemon, i) => (
                    <img
                      key={i}
                      src={pokemon!.sprites.front_default}
                      alt={pokemon!.name}
                      className="w-12 h-12"
                    />
                  ))}
                </div>

                {!showShareDialog ? (
                  <Button onClick={() => setShowShareDialog(true)} className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Compartilhar Time
                  </Button>
                ) : (
                  <div className="space-y-3 bg-background p-4 rounded-lg">
                    <Input
                      placeholder="Nome do time..."
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                    <Input
                      placeholder="Descrição (opcional)..."
                      value={teamDescription}
                      onChange={(e) => setTeamDescription(e.target.value)}
                    />

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Código do Time:</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-mono">
                          {teamCode}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => TeamSharingService.copyToClipboard(teamCode)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleShare}>Publicar</Button>
                      <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {validTeam.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Adicione Pokémon ao seu time para compartilhar!
              </p>
            )}
          </div>

          {/* Quick Share Options */}
          {validTeam.length > 0 && (
            <div className="bg-background p-4 rounded-lg">
              <p className="text-sm font-medium mb-3">Compartilhar via:</p>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Twitter className="w-4 h-4" />
                  Twitter
                </Button>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Discord
                </Button>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <QrCode className="w-4 h-4" />
                  QR Code
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Community Teams */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Times da Comunidade</h2>
        <TeamShowcase />
      </div>
    </div>
  );
}
