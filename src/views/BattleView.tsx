import React, { useState, useEffect, useRef } from 'react';
import {
  UserProfile,
  Monster,
  SocialSkill,
  BattleConsumableItem,
  BattleLogEntry,
  BattleRewardResult,
  AvatarItem,
} from '../types';
import { MONSTERS, SOCIAL_SKILLS, DEFAULT_BATTLE_ITEMS } from '../data/monsters';
import { ITEM_MAP, RARITY_CONFIG } from '../data/items';
import { AvatarDisplay } from '../components/AvatarDisplay';
import { MonsterPixelArt } from '../components/MonsterPixelArt';
import { audio } from '../utils/audio';
import {
  Swords,
  Sparkles,
  Shield,
  Backpack,
  Heart,
  Zap,
  Award,
  ChevronRight,
  Flame,
  Droplets,
  Wind,
  Smile,
  RefreshCw,
  Gift,
  ArrowLeft,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface BattleViewProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onUnlockItem?: (item: AvatarItem) => void;
  onEquipItem?: (category: string, itemId: string) => void;
}

export const BattleView: React.FC<BattleViewProps> = ({
  user,
  onUpdateUser,
  onUnlockItem,
  onEquipItem,
}) => {
  // Stage selection vs In-Battle state
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [inBattle, setInBattle] = useState<boolean>(false);

  // Combat state
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [playerMaxHp, setPlayerMaxHp] = useState<number>(100);
  const [playerSp, setPlayerSp] = useState<number>(50);
  const [playerMaxSp, setPlayerMaxSp] = useState<number>(50);

  const [monsterHp, setMonsterHp] = useState<number>(100);
  const [monsterMaxHp, setMonsterMaxHp] = useState<number>(100);

  const [turn, setTurn] = useState<number>(1);
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [isActionPending, setIsActionPending] = useState<boolean>(false);
  const [isDefending, setIsDefending] = useState<boolean>(false);
  const [defenseBuffTurns, setDefenseBuffTurns] = useState<number>(0);

  // Active animations & popups
  const [playerHit, setPlayerHit] = useState<boolean>(false);
  const [monsterHit, setMonsterHit] = useState<boolean>(false);
  const [playerAttacking, setPlayerAttacking] = useState<boolean>(false);
  const [monsterAttacking, setMonsterAttacking] = useState<boolean>(false);
  const [floatText, setFloatText] = useState<{ id: number; text: string; color: string; isMonster: boolean } | null>(null);

  // Active submenu ('main' | 'skills' | 'items')
  const [activeMenu, setActiveMenu] = useState<'main' | 'skills' | 'items'>('main');

  // Battle consumables inventory
  const [consumables, setConsumables] = useState<BattleConsumableItem[]>(DEFAULT_BATTLE_ITEMS);

  // Battle logs
  const [battleLogs, setBattleLogs] = useState<BattleLogEntry[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Victory / Defeat Modal state
  const [battleResult, setBattleResult] = useState<BattleRewardResult | null>(null);
  const [isDefeatedModal, setIsDefeatedModal] = useState<boolean>(false);

  // Auto-scroll logs to bottom
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [battleLogs]);

  // Calculate player combat stats based on level & equipped weapon
  const playerStats = React.useMemo(() => {
    const baseHp = 90 + user.level * 15;
    const baseSp = 40 + user.level * 8;
    let bonusAtk = 15 + user.level * 3;
    let bonusDef = 5 + user.level * 2;

    if (user.avatar.weapon === 'wpn_tongs_blade') bonusAtk += 15;
    if (user.avatar.weapon === 'wpn_recycle_saber') bonusAtk += 30;
    if (user.avatar.weapon === 'wpn_eco_shield') bonusDef += 20;
    if (user.avatar.weapon === 'wpn_gaia_staff') {
      bonusAtk += 20;
    }

    return { maxHp: baseHp, maxSp: baseSp, atk: bonusAtk, def: bonusDef };
  }, [user.level, user.avatar.weapon]);

  // Add a log entry
  const addLog = (message: string, type: BattleLogEntry['type'] = 'info') => {
    setBattleLogs((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        turn,
        message,
        type,
      },
    ]);
  };

  // Show floating combat popup text
  const triggerFloatText = (text: string, color: string, isMonster: boolean) => {
    setFloatText({ id: Date.now(), text, color, isMonster });
    setTimeout(() => {
      setFloatText(null);
    }, 1200);
  };

  // Start battle with selected monster
  const handleStartBattle = (monster: Monster) => {
    setSelectedMonster(monster);
    setMonsterHp(monster.maxHp);
    setMonsterMaxHp(monster.maxHp);

    setPlayerHp(playerStats.maxHp);
    setPlayerMaxHp(playerStats.maxHp);
    setPlayerSp(playerStats.maxSp);
    setPlayerMaxSp(playerStats.maxSp);

    setTurn(1);
    setIsPlayerTurn(true);
    setIsActionPending(false);
    setIsDefending(false);
    setDefenseBuffTurns(0);
    setActiveMenu('main');
    setBattleResult(null);
    setIsDefeatedModal(false);

    setBattleLogs([
      {
        id: 'init-1',
        turn: 1,
        message: `⚠️ 「${monster.name}」が現れた！`,
        type: 'info',
      },
      {
        id: 'init-2',
        turn: 1,
        message: `💬 ${monster.name}: 「${monster.introQuote}」`,
        type: 'dialogue',
      },
    ]);

    setInBattle(true);
    audio.playLevelUp();
  };

  // Check if monster is in purifiable state
  const isPurifiable = React.useMemo(() => {
    if (!selectedMonster) return false;
    const hpPercent = (monsterHp / monsterMaxHp) * 100;
    return hpPercent <= selectedMonster.purifyThreshold;
  }, [monsterHp, monsterMaxHp, selectedMonster]);

  // Player standard Attack
  const handlePlayerAttack = () => {
    if (!isPlayerTurn || isActionPending || !selectedMonster) return;
    setIsActionPending(true);
    setActiveMenu('main');

    // Player attack animation & audio
    setPlayerAttacking(true);
    audio.playAttack();

    setTimeout(() => {
      setPlayerAttacking(false);

      // Damage calculation with critical hit chance
      const isCrit = Math.random() < 0.2;
      let rawDamage = Math.max(8, playerStats.atk - selectedMonster.defense);
      rawDamage += Math.floor(Math.random() * 6) - 3;
      if (isCrit) rawDamage = Math.floor(rawDamage * 1.6);

      const actualDamage = Math.max(1, rawDamage);
      const newMonsterHp = Math.max(0, monsterHp - actualDamage);
      setMonsterHp(newMonsterHp);

      // Hit effect on monster
      setMonsterHit(true);
      if (isCrit) {
        audio.playCritical();
        triggerFloatText(`CRITICAL! -${actualDamage}`, 'text-amber-300', true);
        addLog(`💥 会心の一撃！${selectedMonster.name}に ${actualDamage} の特大ダメージを与えた！`, 'crit');
      } else {
        audio.playHit();
        triggerFloatText(`-${actualDamage}`, 'text-rose-400', true);
        addLog(`⚔️ プレイヤーの攻撃！${selectedMonster.name}に ${actualDamage} のダメージ！`, 'player');
      }

      setTimeout(() => {
        setMonsterHit(false);

        // Check if monster defeated
        if (newMonsterHp <= 0) {
          handleBattleVictory(false);
        } else {
          // Check for purification threshold notice
          const hpPercent = (newMonsterHp / monsterMaxHp) * 100;
          if (hpPercent <= selectedMonster.purifyThreshold && (monsterHp / monsterMaxHp) * 100 > selectedMonster.purifyThreshold) {
            audio.playMagic();
            addLog(`✨ ${selectedMonster.name}の心が揺らいでいる！「じょうか」コマンドで和解が可能になった！`, 'purify');
          }
          // Monster's turn
          setIsPlayerTurn(false);
          setTimeout(() => {
            executeMonsterTurn(newMonsterHp);
          }, 900);
        }
      }, 400);
    }, 350);
  };

  // Player Social Skill
  const handleUseSkill = (skill: SocialSkill) => {
    if (!isPlayerTurn || isActionPending || !selectedMonster) return;
    if (playerSp < skill.spCost) {
      audio.playError();
      addLog(`❌ SPが足りません！（必要SP: ${skill.spCost} / 現在SP: ${playerSp}）`, 'info');
      return;
    }

    setIsActionPending(true);
    setPlayerSp((prev) => Math.max(0, prev - skill.spCost));
    setActiveMenu('main');

    audio.playMagic();
    setPlayerAttacking(true);

    setTimeout(() => {
      setPlayerAttacking(false);

      if (skill.type === 'heal') {
        // Healing skill
        const healAmount = skill.power + user.level * 4;
        const newHp = Math.min(playerStats.maxHp, playerHp + healAmount);
        setPlayerHp(newHp);
        audio.playHeal();
        triggerFloatText(`+${healAmount} HP`, 'text-emerald-400', false);
        addLog(`💖 ${skill.name}を発動！HPが ${healAmount} 回復した！`, 'heal');

        // Transition to monster turn
        setIsPlayerTurn(false);
        setTimeout(() => executeMonsterTurn(monsterHp), 900);
      } else if (skill.type === 'buff') {
        // Defensive buff
        setDefenseBuffTurns(3);
        audio.playMagic();
        triggerFloatText(`DEF UP!`, 'text-cyan-400', false);
        addLog(`🛡️ ${skill.name}を発動！助け合いの絆で3ターンの間受けるダメージが半減する！`, 'player');

        setIsPlayerTurn(false);
        setTimeout(() => executeMonsterTurn(monsterHp), 900);
      } else if (skill.type === 'purify') {
        // Universal cleanse skill
        const isWeak = selectedMonster.weaknesses.includes(skill.category) || skill.category === 'all';
        const damage = skill.power + (isWeak ? 25 : 0);
        const newMonsterHp = Math.max(0, monsterHp - damage);
        setMonsterHp(newMonsterHp);
        setMonsterHit(true);
        audio.playPurify();
        triggerFloatText(`PURIFY BURST! -${damage}`, 'text-cyan-300', true);
        addLog(`🌟 究極奥義 ${skill.name}！善意の光が${selectedMonster.name}を包み込み ${damage} ダメージ！`, 'purify');

        setTimeout(() => {
          setMonsterHit(false);
          if (newMonsterHp <= 0 || newMonsterHp / monsterMaxHp <= 0.7) {
            // Instant purify trigger
            handleBattleVictory(true);
          } else {
            setIsPlayerTurn(false);
            setTimeout(() => executeMonsterTurn(newMonsterHp), 900);
          }
        }, 500);
      } else {
        // Offensive skill
        const isWeak = selectedMonster.weaknesses.includes(skill.category) || skill.category === 'all';
        let damage = skill.power + playerStats.atk - selectedMonster.defense;
        if (isWeak) damage = Math.floor(damage * 1.5);
        damage = Math.max(12, damage);

        const newMonsterHp = Math.max(0, monsterHp - damage);
        setMonsterHp(newMonsterHp);
        setMonsterHit(true);

        if (isWeak) {
          audio.playCritical();
          triggerFloatText(`WEAKNESS! -${damage}`, 'text-amber-300', true);
          addLog(`🌿 弱点特効！${skill.name}がクリティカルヒット！${selectedMonster.name}に ${damage} ダメージ！`, 'crit');
        } else {
          audio.playHit();
          triggerFloatText(`-${damage}`, 'text-cyan-400', true);
          addLog(`✨ ${skill.name}を発動！${selectedMonster.name}に ${damage} ダメージ！`, 'player');
        }

        setTimeout(() => {
          setMonsterHit(false);
          if (newMonsterHp <= 0) {
            handleBattleVictory(false);
          } else {
            setIsPlayerTurn(false);
            setTimeout(() => executeMonsterTurn(newMonsterHp), 900);
          }
        }, 400);
      }
    }, 350);
  };

  // Player Defend
  const handlePlayerDefend = () => {
    if (!isPlayerTurn || isActionPending) return;
    setIsActionPending(true);
    setIsDefending(true);
    setActiveMenu('main');

    // Defend recovers 8 SP
    setPlayerSp((prev) => Math.min(playerStats.maxSp, prev + 8));
    audio.playItemUnlock();
    triggerFloatText(`GUARD (+8 SP)`, 'text-blue-400', false);
    addLog(`🛡️ プレイヤーは防御姿勢をとった！次の被ダメージが半減し、SPが8回復！`, 'player');

    setIsPlayerTurn(false);
    setTimeout(() => {
      executeMonsterTurn(monsterHp, true);
    }, 900);
  };

  // Player Purify / Reconciliation Attempt
  const handlePlayerPurify = () => {
    if (!isPlayerTurn || isActionPending || !selectedMonster) return;
    if (!isPurifiable) {
      audio.playError();
      addLog(`⚠️ まだモンスターの心が閉ざされています！HPを ${selectedMonster.purifyThreshold}% 以下に減らしてください。`, 'info');
      return;
    }

    setIsActionPending(true);
    setActiveMenu('main');
    audio.playPurify();

    addLog(`✨ プレイヤーは「じょうかの祈り」を捧げた…！`, 'purify');

    setTimeout(() => {
      // High success rate when purifiable
      handleBattleVictory(true);
    }, 1200);
  };

  // Use Consumable Item
  const handleUseItem = (item: BattleConsumableItem) => {
    if (!isPlayerTurn || isActionPending || item.count <= 0 || !selectedMonster) return;
    setIsActionPending(true);

    // Decrement item count
    setConsumables((prev) =>
      prev.map((c) => (c.id === item.id ? { ...c, count: c.count - 1 } : c))
    );
    setActiveMenu('main');

    if (item.effectType === 'heal_hp') {
      const newHp = Math.min(playerStats.maxHp, playerHp + item.value);
      setPlayerHp(newHp);
      audio.playHeal();
      triggerFloatText(`+${item.value} HP`, 'text-emerald-400', false);
      addLog(`🥤 ${item.name}を使用！HPが ${item.value} 回復した！`, 'heal');
    } else if (item.effectType === 'heal_sp') {
      const newSp = Math.min(playerStats.maxSp, playerSp + item.value);
      setPlayerSp(newSp);
      audio.playMagic();
      triggerFloatText(`+${item.value} SP`, 'text-cyan-400', false);
      addLog(`🌿 ${item.name}を使用！SPが ${item.value} 回復した！`, 'heal');
    } else if (item.effectType === 'debuff_enemy') {
      audio.playHit();
      triggerFloatText(`DEF DOWN!`, 'text-purple-400', true);
      addLog(`🧴 ${item.name}を噴射！${selectedMonster.name}の防御力が下がった！`, 'player');
    } else if (item.effectType === 'purify_boost') {
      audio.playItemUnlock();
      triggerFloatText(`PURIFY BOOST!`, 'text-emerald-400', false);
      addLog(`📯 ${item.name}を吹き鳴らした！相棒が応援に駆けつけ、浄化成功率がアップ！`, 'heal');
    }

    // Item uses take action and passes turn to monster
    setIsPlayerTurn(false);
    setTimeout(() => {
      executeMonsterTurn(monsterHp);
    }, 900);
  };

  // Execute Monster's turn AI
  const executeMonsterTurn = (currentMonsterHp: number, playerWasDefending = isDefending) => {
    if (!selectedMonster || currentMonsterHp <= 0) return;

    // Pick a monster move
    const moves = selectedMonster.moves;
    const move = moves[Math.floor(Math.random() * moves.length)];

    setMonsterAttacking(true);
    audio.playAttack();

    setTimeout(() => {
      setMonsterAttacking(false);

      // Damage calculation
      let monsterDamage = Math.max(6, move.power + selectedMonster.attack - playerStats.def);
      monsterDamage += Math.floor(Math.random() * 4) - 2;

      // Apply defense reductions
      if (playerWasDefending) {
        monsterDamage = Math.floor(monsterDamage * 0.5);
      }
      if (defenseBuffTurns > 0) {
        monsterDamage = Math.floor(monsterDamage * 0.5);
      }

      monsterDamage = Math.max(1, monsterDamage);
      const newPlayerHp = Math.max(0, playerHp - monsterDamage);
      setPlayerHp(newPlayerHp);

      // Player hit animation & sound
      setPlayerHit(true);
      audio.playHit();
      triggerFloatText(`-${monsterDamage}`, 'text-rose-500', false);

      addLog(`👾 ${move.dialogue} プレイヤーは ${monsterDamage} のダメージを受けた！`, 'monster');

      setTimeout(() => {
        setPlayerHit(false);
        setIsDefending(false);
        if (defenseBuffTurns > 0) {
          setDefenseBuffTurns((prev) => prev - 1);
        }

        // Check if player defeated
        if (newPlayerHp <= 0) {
          audio.playError();
          addLog(`💀 プレイヤーは力尽きてしまった…！`, 'monster');
          setIsDefeatedModal(true);
        } else {
          // Increment turn & return control to player
          setTurn((prev) => prev + 1);
          setIsPlayerTurn(true);
          setIsActionPending(false);
        }
      }, 400);
    }, 450);
  };

  // Handle Battle Victory / Purification
  const handleBattleVictory = (wasPurified: boolean) => {
    if (!selectedMonster) return;

    audio.playVictory();

    // Calculate rewards (Purification gives 1.3x coins and higher rare item drops!)
    const xpGained = selectedMonster.rewards.xp + (wasPurified ? 25 : 0);
    const coinsGained = Math.floor(selectedMonster.rewards.coins * (wasPurified ? 1.35 : 1.0));

    // Determine drop items
    const dropsEarned: AvatarItem[] = [];
    selectedMonster.rewards.dropItems.forEach((drop) => {
      const dropBonus = wasPurified ? 0.2 : 0.0;
      if (Math.random() < drop.dropRate + dropBonus) {
        const fullItem = ITEM_MAP[drop.itemId];
        if (fullItem) {
          dropsEarned.push(fullItem);
          onUnlockItem?.(fullItem);
        }
      }
    });

    const rewardResult: BattleRewardResult = {
      monsterName: selectedMonster.name,
      wasPurified,
      xpGained,
      coinsGained,
      droppedItems: dropsEarned,
    };

    setBattleResult(rewardResult);

    // Update User Profile State with XP, Coins, and battleRecords
    const currentCoins = user.socialCoins || 0;
    const currentDefeated = user.battleRecords?.monstersDefeated || 0;
    const currentPurified = user.battleRecords?.monstersPurified || 0;
    const clearedStages = user.battleRecords?.clearedStages || [];

    const updatedCleared = clearedStages.includes(selectedMonster.id)
      ? clearedStages
      : [...clearedStages, selectedMonster.id];

    // Compute updated XP & level
    let newXp = user.currentXp + xpGained;
    let newLevel = user.level;
    let newNextXp = user.nextLevelXp;
    let leveledUp = false;

    while (newXp >= newNextXp) {
      newXp -= newNextXp;
      newLevel += 1;
      newNextXp = Math.floor(newNextXp * 1.3);
      leveledUp = true;
    }

    if (leveledUp) {
      audio.playLevelUp();
    }

    const updatedUser: UserProfile = {
      ...user,
      currentXp: newXp,
      level: newLevel,
      nextLevelXp: newNextXp,
      socialCoins: currentCoins + coinsGained,
      unlockedItems: Array.from(
        new Set([...user.unlockedItems, ...dropsEarned.map((d) => d.id)])
      ),
      battleRecords: {
        monstersDefeated: currentDefeated + (wasPurified ? 0 : 1),
        monstersPurified: currentPurified + (wasPurified ? 1 : 0),
        clearedStages: updatedCleared,
      },
    };

    onUpdateUser(updatedUser);

    if (wasPurified) {
      addLog(`✨ ${selectedMonster.name}を浄化し、平和的に和解した！`, 'purify');
      addLog(`💬 ${selectedMonster.name}: 「${selectedMonster.purifiedQuote}」`, 'dialogue');
    } else {
      addLog(`🎉 ${selectedMonster.name}を討伐した！街に平和が戻った！`, 'crit');
      addLog(`💬 ${selectedMonster.name}: 「${selectedMonster.defeatQuote}」`, 'dialogue');
    }
  };

  // Exit battle and return to Stage Select
  const handleExitBattle = () => {
    setInBattle(false);
    setSelectedMonster(null);
    setBattleResult(null);
    setIsDefeatedModal(false);
  };

  return (
    <div id="battle-view-container" className="space-y-6">
      {/* ============================================================ */}
      {/* STAGE SELECT SCREEN (バトル前のステージ選択画面) */}
      {/* ============================================================ */}
      {!inBattle && (
        <div className="space-y-4 sm:space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 sm:p-6 rounded-2xl border border-indigo-500/30 shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] sm:text-xs font-bold border border-indigo-400/30 mb-1.5">
                  <Swords className="w-3.5 h-3.5" /> レトロRPGコマンドバトル
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-wide">
                  社会課題モンスター討伐・浄化クエスト
                </h2>
                <p className="text-xs sm:text-sm text-indigo-200/80 mt-1 max-w-2xl leading-relaxed">
                  現実の社会貢献活動で培ったソーシャルパワーと装備で、街にはびこる環境汚染や社会課題の化身たちに立ち向かおう！
                </p>
              </div>

              {/* User Battle Stats & Social Coins */}
              <div className="grid grid-cols-3 sm:flex items-center gap-1.5 sm:gap-3 bg-slate-950/70 p-2 sm:p-3 rounded-xl border border-indigo-500/30 text-center">
                <div className="px-1.5 sm:px-3 sm:border-r border-slate-800">
                  <div className="text-[10px] sm:text-xs text-slate-400 font-bold">コイン</div>
                  <div className="text-sm sm:text-lg font-black text-amber-400">🪙 {user.socialCoins || 0}</div>
                </div>
                <div className="px-1.5 sm:px-3 sm:border-r border-slate-800">
                  <div className="text-[10px] sm:text-xs text-slate-400 font-bold">浄化数</div>
                  <div className="text-sm sm:text-lg font-black text-emerald-400">✨ {user.battleRecords?.monstersPurified || 0}</div>
                </div>
                <div className="px-1.5 sm:px-3">
                  <div className="text-[10px] sm:text-xs text-slate-400 font-bold">討伐数</div>
                  <div className="text-sm sm:text-lg font-black text-rose-400">⚔️ {user.battleRecords?.monstersDefeated || 0}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Monster Stage List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {MONSTERS.map((mon, index) => {
              const isCleared = user.battleRecords?.clearedStages?.includes(mon.id);
              return (
                <div
                  key={mon.id}
                  id={`stage-card-${mon.id}`}
                  className="bg-slate-900/90 border border-slate-700/80 hover:border-indigo-400/60 transition-all rounded-2xl p-3.5 sm:p-5 flex flex-col justify-between shadow-lg hover:shadow-indigo-950/50"
                >
                  <div>
                    {/* Top Stage Header */}
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="text-[10px] sm:text-xs font-black px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700">
                          {mon.subtitle}
                        </span>
                        {isCleared && (
                          <span className="text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1">
                            <Award className="w-3 h-3" /> CLEAR
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] sm:text-xs font-bold text-slate-400">推奨Lv.{mon.level}</span>
                    </div>

                    {/* Monster Visual & Info */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center p-1 relative overflow-hidden flex-shrink-0">
                        <div className={`absolute inset-0 bg-gradient-to-b ${mon.bgGradient} opacity-40`} />
                        <MonsterPixelArt type={mon.pixelArtType} size={70} />
                      </div>

                      <div className="space-y-0.5 sm:space-y-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5 truncate">
                          <span>{mon.icon}</span> {mon.name}
                        </h3>
                        <p className="text-xs text-indigo-300 font-medium truncate">{mon.title}</p>
                        <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-2 leading-tight">{mon.lore}</p>
                      </div>
                    </div>

                    {/* Stats & Weakness Preview */}
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 bg-slate-950/60 p-2 sm:p-2.5 rounded-lg text-[11px] sm:text-xs mb-3 sm:mb-4">
                      <div>
                        <span className="text-slate-500">HP:</span>{' '}
                        <span className="font-bold text-slate-200">{mon.maxHp}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">ATK:</span>{' '}
                        <span className="font-bold text-rose-300">{mon.attack}</span>
                      </div>
                      <div className="truncate">
                        <span className="text-slate-500">弱点:</span>{' '}
                        <span className="font-bold text-emerald-300">
                          {mon.weaknesses.map((w) => (w === 'environment' ? '環境' : w === 'support' ? '支援' : '学習')).join('/')}
                        </span>
                      </div>
                    </div>

                    {/* Drop Items Preview */}
                    <div className="mb-3 sm:mb-4">
                      <div className="text-[11px] sm:text-xs text-slate-400 mb-1 flex items-center gap-1">
                        <Gift className="w-3.5 h-3.5 text-amber-400" /> レアドロップ報酬:
                      </div>
                      <div className="flex flex-wrap gap-1 sm:gap-1.5">
                        {mon.rewards.dropItems.map((drop) => {
                          const rCfg = RARITY_CONFIG[drop.rarity];
                          return (
                            <div
                              key={drop.itemId}
                              className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md border flex items-center gap-1 ${rCfg.frameBg} ${rCfg.border}`}
                            >
                              <span>{drop.icon}</span>
                              <span className={`font-medium ${rCfg.textColor}`}>{drop.name}</span>
                              <span className="text-[9px] sm:text-[10px] text-slate-400">({Math.round(drop.dropRate * 100)}%)</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Battle Start Button */}
                  <button
                    id={`btn-start-battle-${mon.id}`}
                    onClick={() => handleStartBattle(mon)}
                    className="w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-black text-xs sm:text-sm tracking-wide bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Swords className="w-4 h-4" /> このステージに挑む
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* IN-BATTLE RETRO RPG ARENA (ターン制コマンドバトル画面) */}
      {/* ============================================================ */}
      {inBattle && selectedMonster && (
        <div id="retro-battle-arena" className="space-y-3 sm:space-y-4">
          {/* Top Bar: Battle Stage & Turn */}
          <div className="flex items-center justify-between bg-slate-900 px-3 sm:px-4 py-2 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={handleExitBattle}
                className="text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> 撤退
              </button>
              <span className="font-bold text-white text-[11px] sm:text-xs truncate max-w-[120px] sm:max-w-none">{selectedMonster.subtitle}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="font-mono text-cyan-300 font-bold text-xs">TURN {turn}</span>
              {defenseBuffTurns > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold text-[10px] animate-pulse">
                  🛡️ 防御UP中
                </span>
              )}
            </div>
          </div>

          {/* Battle Stage Arena Frame */}
          <div
            className={`relative w-full h-[310px] sm:h-[360px] md:h-[400px] rounded-2xl border-2 border-slate-700 overflow-hidden shadow-2xl bg-gradient-to-b ${selectedMonster.bgGradient} flex flex-col justify-between p-2.5 sm:p-4 md:p-6`}
          >
            {/* Retro Scanline Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40 z-10" />

            {/* Combat Floating Popups (Damage / Heal / Crit) */}
            {floatText && (
              <div
                className={`absolute z-30 font-black text-lg sm:text-xl md:text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-bounce ${
                  floatText.color
                } ${
                  floatText.isMonster
                    ? 'top-16 right-1/4 -translate-x-1/2'
                    : 'bottom-24 left-1/4 translate-x-1/2'
                }`}
              >
                {floatText.text}
              </div>
            )}

            {/* TOP ROW: MONSTER STATS & SPRITE */}
            <div className="flex justify-between items-start gap-2 z-20">
              {/* Monster Status Box (Left/Center-aligned classic RPG style) */}
              <div className="bg-slate-950/85 backdrop-blur-md p-2 sm:p-3.5 rounded-xl border border-slate-700 w-[160px] xs:w-[185px] sm:w-72 shadow-xl shrink-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-xs sm:text-sm text-white flex items-center gap-1 truncate">
                    <span>{selectedMonster.icon}</span> <span className="truncate">{selectedMonster.name}</span>
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-mono shrink-0">Lv.{selectedMonster.level}</span>
                </div>

                {/* Monster HP Bar */}
                <div className="space-y-0.5 sm:space-y-1">
                  <div className="flex justify-between text-[9px] sm:text-[11px] font-bold">
                    <span className="text-slate-400">HP</span>
                    <span className="font-mono text-slate-200">
                      {monsterHp} / {monsterMaxHp}
                    </span>
                  </div>
                  <div className="w-full h-2 sm:h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                    <div
                      className={`h-full transition-all duration-300 ${
                        monsterHp / monsterMaxHp > 0.5
                          ? 'bg-emerald-500'
                          : monsterHp / monsterMaxHp > 0.25
                          ? 'bg-amber-500'
                          : 'bg-rose-500 animate-pulse'
                      }`}
                      style={{ width: `${(monsterHp / monsterMaxHp) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Purify Readiness Meter */}
                <div className="mt-1 sm:mt-2 pt-1 sm:pt-2 border-t border-slate-800 flex items-center justify-between text-[9px] sm:text-[11px]">
                  <span className="text-slate-400 flex items-center gap-0.5 sm:gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" /> 浄化:
                  </span>
                  {isPurifiable ? (
                    <span className="font-bold text-cyan-300 animate-pulse bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/50 text-[9px] sm:text-[10px]">
                      READY! じょうか可
                    </span>
                  ) : (
                    <span className="text-slate-500 font-mono text-[9px]">HP{selectedMonster.purifyThreshold}%以下</span>
                  )}
                </div>
              </div>

              {/* Monster Pixel Sprite */}
              <div className="flex flex-col items-center mr-1 sm:mr-4 md:mr-16">
                <MonsterPixelArt
                  type={selectedMonster.pixelArtType}
                  size={100}
                  isHit={monsterHit}
                  isAttacking={monsterAttacking}
                />
              </div>
            </div>

            {/* BOTTOM ROW: PLAYER SPRITE & STATS */}
            <div className="flex justify-between items-end gap-2 z-20">
              {/* Player 2-Head-High Pixel Avatar Sprite */}
              <div
                className={`ml-1 sm:ml-4 md:ml-16 transition-all duration-200 ${
                  playerHit ? 'brightness-200 -translate-x-2' : ''
                } ${playerAttacking ? 'translate-x-4 sm:translate-x-6 -translate-y-2' : ''}`}
              >
                <AvatarDisplay
                  avatar={user.avatar}
                  size={95}
                  showBackground={false}
                />
              </div>

              {/* Player HP / SP Box */}
              <div className="bg-slate-950/85 backdrop-blur-md p-2 sm:p-3.5 rounded-xl border border-slate-700 w-[160px] xs:w-[185px] sm:w-72 shadow-xl shrink-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-xs sm:text-sm text-cyan-300 truncate">{user.name}</span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-mono shrink-0">Lv.{user.level}</span>
                </div>

                {/* Player HP */}
                <div className="space-y-0.5 sm:space-y-1 mb-1 sm:mb-2">
                  <div className="flex justify-between text-[9px] sm:text-[11px] font-bold">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> HP
                    </span>
                    <span className="font-mono text-slate-200">
                      {playerHp} / {playerStats.maxHp}
                    </span>
                  </div>
                  <div className="w-full h-2 sm:h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${(playerHp / playerStats.maxHp) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Player SP (Social Points) */}
                <div className="space-y-0.5 sm:space-y-1">
                  <div className="flex justify-between text-[9px] sm:text-[11px] font-bold">
                    <span className="text-cyan-400 flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> SP
                    </span>
                    <span className="font-mono text-slate-200">
                      {playerSp} / {playerStats.maxSp}
                    </span>
                  </div>
                  <div className="w-full h-2 sm:h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                    <div
                      className="h-full bg-cyan-500 transition-all duration-300"
                      style={{ width: `${(playerSp / playerStats.maxSp) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* BATTLE COMMANDS & LOG PANEL (コマンド操作部 & バトルログ) */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
            {/* Left/Main Column: Command Box */}
            <div className="md:col-span-7 bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between min-h-[190px] sm:min-h-[220px]">
              {/* Turn indicator */}
              <div className="text-[11px] sm:text-xs font-bold text-slate-400 mb-1.5 sm:mb-2 flex items-center justify-between">
                <span>{isPlayerTurn ? '▶ あなたのターン：コマンドを選んでください' : '⏳ 敵が行動中…'}</span>
                {activeMenu !== 'main' && (
                  <button
                    onClick={() => setActiveMenu('main')}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 underline text-xs"
                  >
                    戻る
                  </button>
                )}
              </div>

              {/* MAIN COMMAND MENU */}
              {activeMenu === 'main' && (
                <div className="grid grid-cols-2 gap-2 sm:gap-3 flex-1">
                  {/* Attack */}
                  <button
                    id="btn-battle-attack"
                    disabled={!isPlayerTurn || isActionPending}
                    onClick={handlePlayerAttack}
                    className="p-2.5 sm:p-3.5 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-rose-900/80 to-rose-700/80 hover:from-rose-800 hover:to-rose-600 text-white border border-rose-600/40 shadow flex flex-col items-center justify-center gap-0.5 sm:gap-1 disabled:opacity-40 active:scale-95 transition-all"
                  >
                    <Swords className="w-4 h-4 sm:w-5 sm:h-5 text-rose-300" />
                    <span>たたかう</span>
                    <span className="text-[9px] sm:text-[10px] text-rose-200/80 font-normal">通常打撃攻撃</span>
                  </button>

                  {/* Skills */}
                  <button
                    id="btn-battle-skills"
                    disabled={!isPlayerTurn || isActionPending}
                    onClick={() => setActiveMenu('skills')}
                    className="p-2.5 sm:p-3.5 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-cyan-900/80 to-blue-700/80 hover:from-cyan-800 hover:to-blue-600 text-white border border-cyan-600/40 shadow flex flex-col items-center justify-center gap-0.5 sm:gap-1 disabled:opacity-40 active:scale-95 transition-all"
                  >
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300" />
                    <span>スキル (特技)</span>
                    <span className="text-[9px] sm:text-[10px] text-cyan-200/80 font-normal">SP消費・弱点特効</span>
                  </button>

                  {/* Purify / Reconciliation */}
                  <button
                    id="btn-battle-purify"
                    disabled={!isPlayerTurn || isActionPending || !isPurifiable}
                    onClick={handlePlayerPurify}
                    className={`p-2.5 sm:p-3.5 rounded-xl font-black text-xs sm:text-sm border shadow flex flex-col items-center justify-center gap-0.5 sm:gap-1 disabled:opacity-30 active:scale-95 transition-all ${
                      isPurifiable
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white border-emerald-400 shadow-emerald-900/50 animate-pulse'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                    <span>じょうか (浄化)</span>
                    <span className="text-[9px] sm:text-[10px] font-normal">
                      {isPurifiable ? '✨ コイン+35% & ドロップUP' : 'HP低下時に発動可能'}
                    </span>
                  </button>

                  {/* Items / Defend Group */}
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                    <button
                      id="btn-battle-items"
                      disabled={!isPlayerTurn || isActionPending}
                      onClick={() => setActiveMenu('items')}
                      className="p-2 sm:p-2.5 rounded-xl font-bold text-[11px] sm:text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex flex-col items-center justify-center gap-0.5 sm:gap-1 disabled:opacity-40 active:scale-95 transition-all"
                    >
                      <Backpack className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                      <span>どうぐ</span>
                    </button>

                    <button
                      id="btn-battle-defend"
                      disabled={!isPlayerTurn || isActionPending}
                      onClick={handlePlayerDefend}
                      className="p-2 sm:p-2.5 rounded-xl font-bold text-[11px] sm:text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex flex-col items-center justify-center gap-0.5 sm:gap-1 disabled:opacity-40 active:scale-95 transition-all"
                    >
                      <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                      <span>ぼうぎょ</span>
                    </button>
                  </div>
                </div>
              )}

              {/* SKILLS SUBMENU */}
              {activeMenu === 'skills' && (
                <div className="space-y-1.5 sm:space-y-2 flex-1 max-h-[170px] sm:max-h-[220px] overflow-y-auto pr-1">
                  {SOCIAL_SKILLS.map((skill) => {
                    const isWeak = selectedMonster.weaknesses.includes(skill.category) || skill.category === 'all';
                    const canAfford = playerSp >= skill.spCost;
                    return (
                      <button
                        key={skill.id}
                        disabled={!canAfford || !isPlayerTurn || isActionPending}
                        onClick={() => handleUseSkill(skill)}
                        className={`w-full p-2 sm:p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                          canAfford
                            ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 hover:border-cyan-500'
                            : 'bg-slate-950/60 border-slate-800 opacity-40 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                          <span className="text-base sm:text-lg">{skill.icon}</span>
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-white flex items-center gap-1 sm:gap-1.5 truncate">
                              <span className="truncate">{skill.name}</span>
                              {isWeak && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 text-[9px] sm:text-[10px] border border-amber-600 shrink-0">
                                  弱点!
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">{skill.description}</div>
                          </div>
                        </div>
                        <div className="text-[11px] sm:text-xs font-mono font-bold text-cyan-300 flex-shrink-0 ml-1.5 sm:ml-2">
                          SP {skill.spCost}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* ITEMS SUBMENU */}
              {activeMenu === 'items' && (
                <div className="space-y-1.5 sm:space-y-2 flex-1 max-h-[170px] sm:max-h-[220px] overflow-y-auto pr-1">
                  {consumables.map((item) => (
                    <button
                      key={item.id}
                      disabled={item.count <= 0 || !isPlayerTurn || isActionPending}
                      onClick={() => handleUseItem(item)}
                      className={`w-full p-2 sm:p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        item.count > 0
                          ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 hover:border-amber-500'
                          : 'bg-slate-950/60 border-slate-800 opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                        <span className="text-base sm:text-lg">{item.icon}</span>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-white truncate">{item.name}</div>
                          <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">{item.description}</div>
                        </div>
                      </div>
                      <div className="text-xs font-mono font-bold text-amber-400 flex-shrink-0 ml-2">
                        所持: {item.count}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Battle Log Box */}
            <div className="md:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col h-[220px]">
              <div className="text-xs font-bold text-slate-400 mb-2 border-b border-slate-800 pb-1">
                📜 バトル行動ログ
              </div>
              <div className="flex-1 overflow-y-auto space-y-1.5 text-xs font-mono pr-1">
                {battleLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-1.5 rounded ${
                      log.type === 'crit'
                        ? 'bg-amber-950/40 text-amber-300 border-l-2 border-amber-400 font-bold'
                        : log.type === 'purify'
                        ? 'bg-cyan-950/50 text-cyan-300 border-l-2 border-cyan-400 font-bold'
                        : log.type === 'heal'
                        ? 'bg-emerald-950/40 text-emerald-300'
                        : log.type === 'monster'
                        ? 'text-rose-300 bg-rose-950/20'
                        : log.type === 'dialogue'
                        ? 'text-indigo-200 italic'
                        : 'text-slate-300'
                    }`}
                  >
                    {log.message}
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VICTORY & REWARDS MODAL (勝利 & レアドロップ獲得モーダル) */}
      {/* ============================================================ */}
      {battleResult && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 relative overflow-hidden animate-bounce-gentle">
            {/* Header Fanfare Banner */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-500/20 text-amber-300 font-black text-xs border border-amber-400/40">
                {battleResult.wasPurified ? '✨ PURIFIED (和解・浄化完了)' : '⚔️ VICTORY (討伐成功)'}
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white">
                {battleResult.wasPurified ? 'モンスターを清らかに浄化した！' : 'モンスターの討伐に成功した！'}
              </h3>
              <p className="text-xs text-slate-300">
                街の社会課題が解決され、平穏な日常と希望が戻りました。
              </p>
            </div>

            {/* EXP & Social Coins Earned */}
            <div className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
              <div>
                <div className="text-xs text-slate-400 font-bold">獲得EXP</div>
                <div className="text-xl font-black text-cyan-400">+{battleResult.xpGained} EXP</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-bold">ソーシャルコイン</div>
                <div className="text-xl font-black text-amber-400">+{battleResult.coinsGained} 🪙</div>
              </div>
            </div>

            {/* Exclusive Dropped Items */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <Gift className="w-4 h-4 text-amber-400" />
                獲得した限定レア装備 & ドロップ品:
              </div>

              {battleResult.droppedItems.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {battleResult.droppedItems.map((item) => {
                    const rCfg = RARITY_CONFIG[item.rarity];
                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl border flex items-center justify-between ${rCfg.frameBg} ${rCfg.border}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <div className="font-bold text-sm text-white flex items-center gap-2">
                              {item.name}
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${rCfg.badgeBg}`}>
                                {rCfg.label}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400">{item.description}</div>
                          </div>
                        </div>

                        {/* Instant Equip Button */}
                        {onEquipItem && (
                          <button
                            onClick={() => {
                              audio.playItemUnlock();
                              onEquipItem(item.category, item.id);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white flex-shrink-0 ml-2"
                          >
                            装備する
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-slate-500 bg-slate-950/50 p-3 rounded-xl text-center">
                  今回は装備ドロップはありませんでした。コインとEXPを獲得！
                </div>
              )}
            </div>

            {/* Close / Return Button */}
            <button
              onClick={handleExitBattle}
              className="w-full py-3.5 rounded-xl font-black text-sm bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 shadow-lg active:scale-95 transition-all"
            >
              ステージ選択へ戻る
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DEFEATED MODAL (敗北モーダル) */}
      {/* ============================================================ */}
      {isDefeatedModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-rose-500/60 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 text-center">
            <div className="text-4xl">💀</div>
            <div>
              <h3 className="text-2xl font-black text-rose-400">力尽きてしまった…</h3>
              <p className="text-xs text-slate-300 mt-2">
                社会課題モンスターの力は強大でした。日常のクエストでレベルを上げ、新たな装備を整えて再挑戦しましょう！
              </p>
            </div>

            <button
              onClick={handleExitBattle}
              className="w-full py-3 rounded-xl font-black text-sm bg-rose-600 hover:bg-rose-500 text-white transition-all"
            >
              拠点へ戻る
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
