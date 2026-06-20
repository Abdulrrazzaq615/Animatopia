import React, { useState, FormEvent } from 'react';
import { Group, Event } from '../types';
import { Users, MapPin, Calendar, Plus, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GroupsSectionProps {
  groups: Group[];
  events: Event[];
  setGroups: (groups: Group[]) => void;
  setEvents: (events: Event[]) => void;
}

export default function GroupsSection({ groups, events, setGroups, setEvents }: GroupsSectionProps) {
  const [showCreateEventModel, setShowCreateEventModel] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventLoc, setNewEventLoc] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [targetGroupId, setTargetGroupId] = useState('');

  const toggleJoinGroup = (groupId: string) => {
    setGroups(
      groups.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            joined: !g.joined,
            memberCount: g.joined ? g.memberCount - 1 : g.memberCount + 1,
          };
        }
        return g;
      })
    );
  };

  const handleCreateEventSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventLoc.trim() || !newEventTime.trim() || !targetGroupId) return;

    const newEvent: Event = {
      id: `event_${Date.now()}`,
      groupId: targetGroupId,
      title: newEventTitle,
      description: newEventDesc,
      location: newEventLoc,
      startTime: newEventTime,
      rsvpCount: 1,
      userRsvp: 'going',
    };

    setEvents([...events, newEvent]);
    setNewEventTitle('');
    setNewEventDesc('');
    setNewEventLoc('');
    setNewEventTime('');
    setTargetGroupId('');
    setShowCreateEventModel(false);
  };

  const handleRsvpChange = (eventId: string, rsvpState: 'going' | 'maybe' | 'not_going') => {
    setEvents(
      events.map((ev) => {
        if (ev.id === eventId) {
          const wasRsvpGoing = ev.userRsvp === 'going';
          const isNowGoing = rsvpState === 'going';
          
          let counterChange = 0;
          if (!wasRsvpGoing && isNowGoing) counterChange = 1;
          else if (wasRsvpGoing && !isNowGoing) counterChange = -1;

          return {
            ...ev,
            userRsvp: ev.userRsvp === rsvpState ? null : rsvpState,
            rsvpCount: ev.rsvpCount + (ev.userRsvp === rsvpState ? (wasRsvpGoing ? -1 : 0) : counterChange),
          };
        }
        return ev;
      })
    );
  };

  const getGroupName = (groupId: string) => {
    return groups.find((g) => g.id === groupId)?.name || 'Kaimosi Anime Club';
  };

  return (
    <div className="flex flex-col gap-8 w-full pb-24">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-brand-purple/40 to-transparent p-6 rounded-2xl border border-brand-sakura/10">
        <div>
          <h2 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            Local Clubs & Events <Calendar className="w-5 h-5 text-brand-orange animate-pulse" />
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Connect inside physical clubs around Kaimosi. Organize anime streams, gaming sessions and sketching.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Local Anime Groups */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-[#ffb7c5]/5 pb-3">
            <Users className="w-5 h-5 text-brand-orange" />
            <h3 className="text-white font-display font-bold text-base">Anime Groups</h3>
          </div>

          <div className="flex flex-col gap-4">
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-brand-card rounded-2xl border border-white/[0.04] p-5 hover:border-brand-orange/20 transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between overflow-hidden relative shadow-lg"
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={group.imageUrl}
                    className="w-14 h-14 rounded-2xl object-cover border border-[#ffb7c5]/10 shrink-0"
                    alt={group.name}
                  />
                  <div>
                    <h4 className="text-white font-medium text-sm font-display">{group.name}</h4>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2 max-w-sm">{group.description}</p>
                    <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-500 font-mono">
                      <span className="flex items-center gap-1.5 bg-brand-bg px-2 py-0.5 rounded">
                        <MapPin className="w-3 h-3 text-brand-orange" />
                        {group.location}
                      </span>
                      <span>{group.memberCount} wasee</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0 shrink-0">
                  <button
                    onClick={() => toggleJoinGroup(group.id)}
                    className={`w-full sm:w-24 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      group.joined
                        ? 'bg-brand-purple/40 text-brand-sakura border border-brand-sakura/10 hover:bg-brand-sakura hover:text-brand-bg'
                        : 'bg-brand-orange text-white hover:opacity-90'
                    }`}
                  >
                    {group.joined ? 'Joined ✓' : 'Join Club'}
                  </button>

                  {group.joined && (
                    <button
                      onClick={() => {
                        setTargetGroupId(group.id);
                        setShowCreateEventModel(true);
                      }}
                      className="w-full sm:w-24 text-[10px] bg-white/[0.02] text-gray-400 hover:text-white py-1 rounded-lg border border-[#ffb7c5]/5 hover:bg-white/[0.04]"
                    >
                      + Plan Event
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Meetups & Screening Events */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-[#ffb7c5]/5 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-orange" />
              <h3 className="text-white font-display font-bold text-base">Meetups zetu</h3>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {events.map((event) => {
              const formattedTime = new Date(event.startTime).toLocaleDateString('ne-KE', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={event.id}
                  className="bg-brand-card rounded-2xl border border-white/[0.04] p-5 hover:border-brand-orange/20 transition-all flex flex-col justify-between gap-4"
                >
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-brand-sakura font-bold font-mono">
                      {getGroupName(event.groupId)}
                    </span>
                    <h4 className="text-white font-medium text-sm font-display mt-1">{event.title}</h4>
                    <p className="text-xs text-gray-400 mt-1 lines-clamp-2 leading-relaxed">{event.description}</p>
                    
                    <div className="flex flex-col sm:flex-row gap-x-6 gap-y-1.5 mt-4 text-[11px] text-gray-500 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                        {formattedTime}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                        {event.location}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-white/[0.05] pt-4 flex items-center justify-between flex-wrap gap-4">
                    <span className="text-xs font-mono font-semibold text-brand-sakura bg-brand-purple/40 px-3 py-1 rounded-lg border border-[#ffb7c5]/5">
                      {event.rsvpCount} are going
                    </span>

                    <div className="flex gap-2">
                      {(['going', 'maybe'] as const).map((rsvp) => {
                        const isSelected = event.userRsvp === rsvp;
                        return (
                          <button
                            key={rsvp}
                            onClick={() => handleRsvpChange(event.id, rsvp)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                              isSelected
                                ? 'bg-brand-orange text-white'
                                : 'bg-brand-bg/60 text-gray-400 border border-white/[0.04] hover:text-white hover:bg-brand-bg'
                            }`}
                          >
                            {rsvp}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {events.length === 0 && (
              <div className="p-12 text-center text-gray-500 text-xs">
                Hakuna meetup zilizopangwa sasa hivi. Plan moja msee!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Meetup Planner Modal */}
      <AnimatePresence>
        {showCreateEventModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-brand-card w-full max-w-md rounded-2xl overflow-hidden border border-[#ffb7c5]/20 shadow-2xl flex flex-col p-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#ffb7c5]/5">
                <h3 className="font-display font-bold text-white text-base">Plan a Local Meetup</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateEventModel(false);
                    setTargetGroupId('');
                  }}
                  className="text-gray-400 hover:text-white text-lg font-bold"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleCreateEventSubmit} className="flex flex-col gap-4 mt-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 uppercase font-mono">Meetup Title</label>
                  <input
                    type="text"
                    required
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="e.g. Weekly Screening or Manga sketching"
                    className="w-full bg-brand-bg border border-[#ffb7c5]/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 uppercase font-mono">Description</label>
                  <textarea
                    required
                    value={newEventDesc}
                    onChange={(e) => setNewEventDesc(e.target.value)}
                    placeholder="What will wasee do? What about tea and sodas?"
                    className="w-full bg-brand-bg border border-[#ffb7c5]/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-orange resize-none h-20"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 uppercase font-mono">Location Venue</label>
                  <input
                    type="text"
                    required
                    value={newEventLoc}
                    onChange={(e) => setNewEventLoc(e.target.value)}
                    placeholder="e.g. Cafe, Campus ground, Academic Hall"
                    className="w-full bg-brand-bg border border-[#ffb7c5]/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 uppercase font-mono">Meetup Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full bg-brand-bg border border-[#ffb7c5]/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 bg-brand-orange hover:bg-brand-sakura hover:text-brand-bg text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                >
                  Create Event
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
