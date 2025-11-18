/**
 * Complete TypeScript definitions for PokeAPI entities
 * Documentation: https://pokeapi.co/docs/v2
 */

// Move types
export interface Move {
  id: number;
  name: string;
  accuracy: number | null;
  pp: number;
  power: number | null;
  priority: number;
  type: {
    name: string;
    url: string;
  };
  damage_class: {
    name: 'physical' | 'special' | 'status';
    url: string;
  };
  effect_entries: {
    effect: string;
    short_effect: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  effect_chance: number | null;
  target: {
    name: string;
    url: string;
  };
  learned_by_pokemon: {
    name: string;
    url: string;
  }[];
  machines: {
    machine: {
      url: string;
    };
    version_group: {
      name: string;
      url: string;
    };
  }[];
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
    version_group: {
      name: string;
      url: string;
    };
  }[];
  generation: {
    name: string;
    url: string;
  };
  meta: {
    ailment: {
      name: string;
    };
    category: {
      name: string;
    };
    min_hits: number | null;
    max_hits: number | null;
    min_turns: number | null;
    max_turns: number | null;
    drain: number;
    healing: number;
    crit_rate: number;
    ailment_chance: number;
    flinch_chance: number;
    stat_chance: number;
  };
}

export interface MoveListItem {
  name: string;
  url: string;
}

export interface MoveListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: MoveListItem[];
}

// Ability types
export interface Ability {
  id: number;
  name: string;
  is_main_series: boolean;
  generation: {
    name: string;
    url: string;
  };
  names: {
    name: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  effect_entries: {
    effect: string;
    short_effect: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
    version_group: {
      name: string;
      url: string;
    };
  }[];
  pokemon: {
    is_hidden: boolean;
    slot: number;
    pokemon: {
      name: string;
      url: string;
    };
  }[];
}

export interface AbilityListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

// Encounter types
export interface LocationArea {
  id: number;
  name: string;
  location: {
    name: string;
    url: string;
  };
  encounter_method_rates: {
    encounter_method: {
      name: string;
      url: string;
    };
    version_details: {
      rate: number;
      version: {
        name: string;
        url: string;
      };
    }[];
  }[];
  pokemon_encounters: {
    pokemon: {
      name: string;
      url: string;
    };
    version_details: {
      version: {
        name: string;
        url: string;
      };
      max_chance: number;
      encounter_details: {
        min_level: number;
        max_level: number;
        condition_values: any[];
        chance: number;
        method: {
          name: string;
          url: string;
        };
      }[];
    }[];
  }[];
}

export interface PokemonEncounter {
  location_area: {
    name: string;
    url: string;
  };
  version_details: {
    version: {
      name: string;
      url: string;
    };
    max_chance: number;
    encounter_details: {
      min_level: number;
      max_level: number;
      condition_values: any[];
      chance: number;
      method: {
        name: string;
        url: string;
      };
    }[];
  }[];
}

// Evolution types
export interface EvolutionChain {
  id: number;
  baby_trigger_item: {
    name: string;
    url: string;
  } | null;
  chain: EvolutionChainLink;
}

export interface EvolutionChainLink {
  is_baby: boolean;
  species: {
    name: string;
    url: string;
  };
  evolution_details: EvolutionDetail[];
  evolves_to: EvolutionChainLink[];
}

export interface EvolutionDetail {
  item: {
    name: string;
    url: string;
  } | null;
  trigger: {
    name: string;
    url: string;
  };
  gender: number | null;
  held_item: {
    name: string;
    url: string;
  } | null;
  known_move: {
    name: string;
    url: string;
  } | null;
  known_move_type: {
    name: string;
    url: string;
  } | null;
  location: {
    name: string;
    url: string;
  } | null;
  min_level: number | null;
  min_happiness: number | null;
  min_beauty: number | null;
  min_affection: number | null;
  needs_overworld_rain: boolean;
  party_species: {
    name: string;
    url: string;
  } | null;
  party_type: {
    name: string;
    url: string;
  } | null;
  relative_physical_stats: number | null;
  time_of_day: string;
  trade_species: {
    name: string;
    url: string;
  } | null;
  turn_upside_down: boolean;
}

// Egg Group types
export interface EggGroup {
  id: number;
  name: string;
  names: {
    name: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  pokemon_species: {
    name: string;
    url: string;
  }[];
}

// Pokemon Species (for flavor text and evolution chain)
export interface PokemonSpecies {
  id: number;
  name: string;
  order: number;
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  hatch_counter: number;
  has_gender_differences: boolean;
  forms_switchable: boolean;
  growth_rate: {
    name: string;
    url: string;
  };
  pokedex_numbers: {
    entry_number: number;
    pokedex: {
      name: string;
      url: string;
    };
  }[];
  egg_groups: {
    name: string;
    url: string;
  }[];
  color: {
    name: string;
    url: string;
  };
  shape: {
    name: string;
    url: string;
  };
  evolves_from_species: {
    name: string;
    url: string;
  } | null;
  evolution_chain: {
    url: string;
  };
  habitat: {
    name: string;
    url: string;
  } | null;
  generation: {
    name: string;
    url: string;
  };
  names: {
    name: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
    version: {
      name: string;
      url: string;
    };
  }[];
  form_descriptions: {
    description: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  genera: {
    genus: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  varieties: {
    is_default: boolean;
    pokemon: {
      name: string;
      url: string;
    };
  }[];
}

// Version Group
export interface VersionGroup {
  id: number;
  name: string;
  order: number;
  generation: {
    name: string;
    url: string;
  };
  move_learn_methods: {
    name: string;
    url: string;
  }[];
  pokedexes: {
    name: string;
    url: string;
  }[];
  regions: {
    name: string;
    url: string;
  }[];
  versions: {
    name: string;
    url: string;
  }[];
}

// Generation
export interface Generation {
  id: number;
  name: string;
  abilities: {
    name: string;
    url: string;
  }[];
  names: {
    name: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  main_region: {
    name: string;
    url: string;
  };
  moves: {
    name: string;
    url: string;
  }[];
  pokemon_species: {
    name: string;
    url: string;
  }[];
  types: {
    name: string;
    url: string;
  }[];
  version_groups: {
    name: string;
    url: string;
  }[];
}

// Type (for damage relations)
export interface Type {
  id: number;
  name: string;
  damage_relations: {
    no_damage_to: { name: string; url: string }[];
    half_damage_to: { name: string; url: string }[];
    double_damage_to: { name: string; url: string }[];
    no_damage_from: { name: string; url: string }[];
    half_damage_from: { name: string; url: string }[];
    double_damage_from: { name: string; url: string }[];
  };
  game_indices: {
    game_index: number;
    generation: {
      name: string;
      url: string;
    };
  }[];
  generation: {
    name: string;
    url: string;
  };
  move_damage_class: {
    name: string;
    url: string;
  } | null;
  names: {
    name: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  pokemon: {
    slot: number;
    pokemon: {
      name: string;
      url: string;
    };
  }[];
  moves: {
    name: string;
    url: string;
  }[];
}

// Extended Pokemon type with moves
export interface PokemonWithMoves {
  id: number;
  name: string;
  moves: {
    move: {
      name: string;
      url: string;
    };
    version_group_details: {
      level_learned_at: number;
      version_group: {
        name: string;
        url: string;
      };
      move_learn_method: {
        name: string;
        url: string;
      };
    }[];
  }[];
}

