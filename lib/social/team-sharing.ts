import { SharedTeam } from '@/types/app';
import { TeamPokemon } from '@/types/pokemon';
import QRCode from 'qrcode';

export class TeamSharingService {
  static generateTeamCode(team: (TeamPokemon | null)[]): string {
    const validTeam = team.filter((p) => p !== null) as TeamPokemon[];
    const ids = validTeam.map((p) => p.id);

    // Convert IDs to base36 and join
    return ids.map((id) => id.toString(36)).join('-');
  }

  static async decodeTeamCode(code: string): Promise<number[]> {
    const ids = code.split('-').map((part) => parseInt(part, 36));
    return ids.filter((id) => !isNaN(id) && id > 0);
  }

  static createSharedTeam(
    team: (TeamPokemon | null)[],
    name: string,
    description: string,
    author: string,
    authorId: string,
    tags: string[] = []
  ): SharedTeam {
    const validTeam = team.filter((p) => p !== null) as TeamPokemon[];

    return {
      id: Date.now().toString(),
      code: this.generateTeamCode(team),
      name,
      description,
      author,
      authorId,
      pokemon: validTeam,
      likes: 0,
      views: 0,
      tags,
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  static async generateQRCode(teamCode: string): Promise<string> {
    try {
      const url = `${window.location.origin}/shared-team/${teamCode}`;
      return await QRCode.toDataURL(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
      return '';
    }
  }

  static copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log('Copied to clipboard');
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  }

  static generateShareText(team: SharedTeam): string {
    return `Confira meu time Pokémon: "${team.name}"! 🎮\n\n${team.description}\n\nCódigo: ${team.code}`;
  }

  static shareToTwitter(team: SharedTeam): void {
    const text = encodeURIComponent(this.generateShareText(team));
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, '_blank');
  }

  static shareToDiscord(team: SharedTeam): void {
    const text = this.generateShareText(team);
    this.copyToClipboard(text);
    alert('Texto copiado! Cole no Discord.');
  }

  static getTypeTags(team: (TeamPokemon | null)[]): string[] {
    const validTeam = team.filter((p) => p !== null) as TeamPokemon[];
    const types = new Set<string>();

    validTeam.forEach((pokemon) => {
      pokemon.types.forEach((t) => types.add(t.type.name));
    });

    const typesArray = Array.from(types);

    // Check for mono-type
    if (typesArray.length === 1) {
      return ['mono-type', typesArray[0]];
    }

    // Check for balanced
    if (typesArray.length >= 6) {
      return ['balanced', ...typesArray.slice(0, 3)];
    }

    return typesArray;
  }
}
