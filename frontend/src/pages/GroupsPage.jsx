import { useEffect, useState } from 'react'
import { api } from '../services/api.js'

const tabs = [
  { id: 'groups', label: 'My groups', icon: '♧' },
  { id: 'requests', label: 'Join requests', icon: '✉' },
  { id: 'security', label: 'Group security', icon: '⌑' },
]

function Toggle({ checked, onChange, label, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition disabled:cursor-not-allowed disabled:opacity-50 ${checked ? 'bg-brand' : 'bg-slate-300'}`}
    >
      <span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition ${checked ? 'translate-x-5' : ''}`} />
    </button>
  )
}

function Modal({ title, description, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-labelledby="group-modal-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="group-modal-title" className="font-display text-xl font-extrabold">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100">×</button>
        </div>
        {children}
      </section>
    </div>
  )
}

export default function GroupsPage() {
  const [activeTab, setActiveTab] = useState('groups')
  const [myGroups, setMyGroups] = useState([])
  const [requests, setRequests] = useState([])
  const [invites, setInvites] = useState([])
  const [outgoingRequests, setOutgoingRequests] = useState([])
  const [modal, setModal] = useState(null)
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [notice, setNotice] = useState('')
  const [pageError, setPageError] = useState('')
  const [loadingGroups, setLoadingGroups] = useState(true)
  const [creatingGroup, setCreatingGroup] = useState(false)
  const [privacy, setPrivacy] = useState({ sharing: false, precision: 'approximate', duration: 'until-turned-off' })
  const [groupSharing, setGroupSharing] = useState({})

  const selectedGroup = myGroups.find(group => group.id === selectedGroupId) || myGroups[0]

  useEffect(() => {
    let active = true

    async function loadGroups() {
      try {
        const response = await api.get('/groups')
        if (!active) return
        setMyGroups(response.data.groups)
        setSelectedGroupId(current => response.data.groups.some(group => group.id === current)
          ? current
          : response.data.groups[0]?.id || '')
      } catch (error) {
        if (active) setPageError(error.response?.data?.error || 'Could not load your groups. Please try again.')
      } finally {
        if (active) setLoadingGroups(false)
      }
    }

    void loadGroups()
    return () => { active = false }
  }, [])

  function changeTab(tab) {
    setActiveTab(tab)
    setNotice('')
  }

  async function createGroup(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name')).trim()
    const description = String(form.get('description')).trim()
    const isPrivate = form.get('privacy') === 'private'
    setPageError('')
    setCreatingGroup(true)
    try {
      const response = await api.post('/groups', { name, description, isPrivate })
      const group = response.data.group
      setMyGroups(current => [group, ...current])
      setGroupSharing(current => ({ ...current, [group.id]: false }))
      setSelectedGroupId(group.id)
      setModal(null)
      setNotice(`${name} is saved. You are the group admin.`)
    } catch (error) {
      setPageError(error.response?.data?.error || 'Could not create the group. Please try again.')
    } finally {
      setCreatingGroup(false)
    }
  }

  function sendInvite(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email')).trim()
    const invite = { id: `invite-${Date.now()}`, email, groupId: selectedGroup?.id, groupName: selectedGroup?.name }
    setInvites(current => [invite, ...current])
    setModal(null)
    setNotice(`Invite prepared for ${email}. This demo does not send email.`)
  }

  function joinByCode(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const code = String(form.get('code')).trim().toUpperCase()
    setModal(null)
    setOutgoingRequests(current => [{ id: `outgoing-${Date.now()}`, code }, ...current])
    setNotice(`Join request sent with code ${code}. It will appear here when a group admin responds.`)
  }

  function respondToRequest(request, accepted) {
    setRequests(current => current.filter(item => item.id !== request.id))
    if (accepted) {
      setMyGroups(current => current.map(group => group.id === request.groupId ? { ...group, members: group.members + 1 } : group))
      setNotice(`${request.name} was added to ${request.groupName}.`)
    } else {
      setNotice(`Join request from ${request.name} was declined.`)
    }
  }

  function removeInvite(invite) {
    setInvites(current => current.filter(item => item.id !== invite.id))
    setNotice(`Invite for ${invite.email} was cancelled.`)
  }

  function setPrivacyValue(key, value) {
    setPrivacy(current => ({ ...current, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-brand">Your people, your choice</p>
          <h1 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">Group management</h1>
          <p className="mt-2 text-sm text-slate-500">Create your circles, manage who joins, and choose what you share.</p>
        </div>
        {activeTab === 'groups' && (
          <div className="flex gap-2">
            <button type="button" onClick={() => setModal('join')} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 hover:border-brand/40">Join a group</button>
            <button type="button" onClick={() => setModal('create')} className="rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20">＋ Create group</button>
          </div>
        )}
      </header>

      <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-800">
        Your account and groups are saved to the backend. Invitations, join requests, and privacy preferences are still demo-only; no location is shared.
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-xl border border-slate-100 bg-white p-1.5 shadow-sm" role="tablist" aria-label="Group management sections">
        {tabs.map(tab => (
          <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} onClick={() => changeTab(tab.id)} className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition ${activeTab === tab.id ? 'bg-brand/10 text-brand' : 'text-slate-500 hover:bg-slate-50'}`}>
            <span>{tab.icon}</span>{tab.label}
            {tab.id === 'requests' && requests.length > 0 && <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] text-rose-700">{requests.length}</span>}
          </button>
        ))}
      </div>

      {notice && <div role="status" className="flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><span>{notice}</span><button type="button" onClick={() => setNotice('')} aria-label="Dismiss message" className="font-bold">×</button></div>}
      {pageError && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{pageError}</div>}

      {activeTab === 'groups' && (
        <div className="grid gap-5 xl:grid-cols-[1.3fr_.7fr]">
          <section className="space-y-4">
            {loadingGroups && <p className="rounded-xl bg-white p-5 text-sm text-slate-500">Loading your groups…</p>}
            {!loadingGroups && myGroups.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center"><p className="font-bold text-ink">No groups yet</p><p className="mt-1 text-sm text-slate-500">Create a group to start your first circle.</p><button type="button" onClick={() => setModal('create')} className="mt-4 rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white">＋ Create group</button></div>}
            {myGroups.map(group => (
              <article key={group.id} className={`rounded-2xl border bg-white p-5 shadow-sm transition ${selectedGroupId === group.id ? 'border-brand/30 ring-2 ring-brand/5' : 'border-slate-100'}`}>
                <div className="flex flex-wrap items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-lg text-white" style={{ background: group.color }}>⌘</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-lg font-extrabold">{group.name}</h2>
                      <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-brand">{group.role}</span>
                      {group.isPrivate !== false && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">Private</span>}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{group.description || `${group.active ? 'Active now' : 'Last active recently'} · Your trusted circle`}</p>
                    <p className="mt-2 text-xs text-slate-400">{group.members} {group.members === 1 ? 'member' : 'members'} · {group.active ? 'Active now' : 'Last active 2h ago'}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  <button type="button" onClick={() => { setSelectedGroupId(group.id); setModal('invite') }} className="rounded-lg bg-brand px-3.5 py-2 text-xs font-bold text-white">＋ Invite members</button>
                  <button type="button" onClick={() => { setSelectedGroupId(group.id); setActiveTab('security') }} className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-600 hover:border-brand/40">Privacy settings</button>
                  <button type="button" onClick={() => { setSelectedGroupId(group.id); setNotice(`${group.name} selected · ${group.members} ${group.members === 1 ? 'member' : 'members'} · You are ${group.role.toLowerCase()}.`) }} className="ml-auto rounded-lg px-3.5 py-2 text-xs font-bold text-brand hover:bg-violet-50">View details</button>
                </div>
              </article>
            ))}
            <button type="button" onClick={() => setModal('create')} className="w-full rounded-2xl border border-dashed border-slate-300 bg-white py-5 text-sm font-bold text-slate-500 hover:border-brand hover:text-brand">＋ Create another group</button>
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div><h2 className="font-display font-bold">Selected group</h2><p className="mt-1 text-xs text-slate-400">Manage your current circle</p></div>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-lg text-brand">♧</span>
              </div>
              <label className="mt-5 block text-xs font-bold text-slate-500" htmlFor="selected-group">Choose a group</label>
              <select id="selected-group" value={selectedGroup?.id || ''} onChange={event => setSelectedGroupId(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-brand">
                {myGroups.map(group => <option key={group.id} value={group.id}>{group.name}</option>)}
              </select>
              {selectedGroup && <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <p className="font-bold">{selectedGroup.name}</p>
                <p className="mt-1 text-xs text-slate-500">{selectedGroup.members} {selectedGroup.members === 1 ? 'member' : 'members'} · You are {selectedGroup.role.toLowerCase()}</p>
                <button type="button" onClick={() => setModal('invite')} className="mt-3 w-full rounded-lg bg-white py-2.5 text-xs font-bold text-brand shadow-sm hover:bg-violet-50">Invite someone to this group</button>
              </div>}
            </section>
            <section className="rounded-2xl bg-[#f6f5ff] p-5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-brand shadow-sm">✦</span>
              <h2 className="mt-3 font-display font-bold">Safety is shared</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">Only invite people you trust. You can pause location sharing at any time in Group security.</p>
              <button type="button" onClick={() => setActiveTab('security')} className="mt-3 text-xs font-bold text-brand">Review security settings →</button>
            </section>
          </aside>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><h2 className="font-display text-lg font-extrabold">Incoming join requests</h2><p className="mt-1 text-sm text-slate-500">Accept only people you recognize and trust.</p></div>
              <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">{requests.length} pending</span>
            </div>
            {requests.length ? <div className="mt-5 space-y-3">
              {requests.map(request => <article key={request.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-xs font-bold text-white" style={{ background: request.color }}>{request.initials}</span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{request.name}</p><p className="truncate text-xs text-slate-400">{request.email} · wants to join {request.groupName}</p></div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => respondToRequest(request, false)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">Decline</button>
                  <button type="button" onClick={() => respondToRequest(request, true)} className="rounded-lg bg-brand px-3 py-2 text-xs font-bold text-white">Accept</button>
                </div>
              </article>)}
            </div> : <div className="mt-5 rounded-xl bg-slate-50 px-4 py-10 text-center"><span className="text-2xl">✓</span><p className="mt-2 text-sm font-bold">You’re all caught up</p><p className="mt-1 text-xs text-slate-500">New requests will appear here.</p></div>}
          </section>
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div><h2 className="font-display text-lg font-extrabold">Sent invites</h2><p className="mt-1 text-sm text-slate-500">Invites prepared from this demo session.</p></div>
            {invites.length ? <div className="mt-5 space-y-3">{invites.map(invite => <div key={invite.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-white text-brand">✉</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{invite.email}</p><p className="text-xs text-slate-400">{invite.groupName} · Pending</p></div><button type="button" onClick={() => removeInvite(invite)} className="text-xs font-bold text-rose-600 hover:underline">Cancel</button></div>)}</div> : <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No invites yet. Invite a member from My groups.</p>}
            <button type="button" onClick={() => { setActiveTab('groups'); setModal('invite') }} className="mt-4 w-full rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-600 hover:border-brand/40">＋ Prepare an invite</button>
          </section>
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm xl:col-start-2">
            <div><h2 className="font-display font-bold">Your join requests</h2><p className="mt-1 text-sm text-slate-500">Requests you sent using an invite code.</p></div>
            {outgoingRequests.length ? <div className="mt-4 space-y-2">{outgoingRequests.map(request => <div key={request.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-white text-brand">↗</span><div className="min-w-0 flex-1"><p className="text-sm font-bold">Code {request.code}</p><p className="text-xs text-slate-400">Awaiting group admin approval</p></div><button type="button" onClick={() => { setOutgoingRequests(current => current.filter(item => item.id !== request.id)); setNotice(`Join request for code ${request.code} was cancelled.`) }} className="text-xs font-bold text-rose-600 hover:underline">Cancel</button></div>)}</div> : <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No join requests sent.</p>}
          </section>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
          <section className="space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div><p className="text-xs font-bold uppercase tracking-wider text-brand">Your location</p><h2 className="mt-1 font-display text-lg font-extrabold">Location privacy</h2><p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">You control when your location is shared and how much detail your groups can see.</p></div>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet-50 text-lg text-brand">⌖</span>
              </div>
              <div className="mt-5 flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-4">
                <div><p className="text-sm font-bold">Share my location</p><p className="mt-1 text-xs text-slate-500">This demo preference does not send or share your location.</p></div>
                <Toggle checked={privacy.sharing} onChange={value => setPrivacyValue('sharing', value)} label="Share my location" />
              </div>
              <fieldset className={`mt-5 ${!privacy.sharing ? 'opacity-50' : ''}`} disabled={!privacy.sharing}>
                <legend className="text-sm font-bold">Location precision</legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {[{ id: 'approximate', title: 'Approximate', text: 'Share a nearby area, not your exact pin.' }, { id: 'exact', title: 'Exact', text: 'Share your precise live location.' }].map(option => <label key={option.id} className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${privacy.precision === option.id ? 'border-brand bg-violet-50/50' : 'border-slate-200'}`}><input type="radio" name="precision" value={option.id} checked={privacy.precision === option.id} onChange={() => setPrivacyValue('precision', option.id)} className="mt-1 accent-[#635bff]" /><span><span className="block text-sm font-bold">{option.title}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{option.text}</span></span></label>)}
                </div>
                <label htmlFor="sharing-duration" className="mt-5 block text-sm font-bold">Sharing duration</label>
                <select id="sharing-duration" value={privacy.duration} onChange={event => setPrivacyValue('duration', event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-brand sm:max-w-sm">
                  <option value="until-turned-off">Until I turn it off</option>
                  <option value="one-hour">For 1 hour</option>
                  <option value="eight-hours">For 8 hours</option>
                </select>
              </fieldset>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <h2 className="font-display text-lg font-extrabold">Share with groups</h2><p className="mt-1 text-sm text-slate-500">Choose which circles can see your location.</p>
              <div className="mt-4 divide-y divide-slate-100">{myGroups.map(group => <div key={group.id} className="flex items-center justify-between gap-4 py-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl text-white" style={{ background: group.color }}>⌘</span><div><p className="text-sm font-bold">{group.name}</p><p className="mt-0.5 text-xs text-slate-400">{group.members} {group.members === 1 ? 'member' : 'members'}</p></div></div><Toggle checked={Boolean(groupSharing[group.id])} disabled={!privacy.sharing} onChange={value => setGroupSharing(current => ({ ...current, [group.id]: value }))} label={`Share location with ${group.name}`} /></div>)}</div>
            </div>
          </section>
          <aside className="space-y-4">
            <section className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-amber-600">!</span>
              <h2 className="mt-3 font-display font-bold text-amber-950">Your privacy matters</h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-900/80">
                <li>• Location sharing is optional and can be paused instantly.</li>
                <li>• Only selected groups can see your location.</li>
                <li>• Approximate sharing hides your exact position.</li>
              </ul>
            </section>
            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <h2 className="font-display font-bold">Group access</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">Review who is in your circles and invite or remove access from My groups.</p>
              <button type="button" onClick={() => setActiveTab('groups')} className="mt-4 w-full rounded-xl bg-slate-50 py-3 text-xs font-bold text-brand hover:bg-violet-50">Manage my groups →</button>
            </section>
          </aside>
        </div>
      )}

      {modal === 'create' && <Modal title="Create a group" description="Start a trusted circle for the people in your life." onClose={() => setModal(null)}>
        <form onSubmit={createGroup} className="mt-5 space-y-4">
          <label className="block text-xs font-bold text-slate-600">Group name<input name="name" required maxLength="40" placeholder="e.g. College friends" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal outline-none focus:border-brand" /></label>
          <label className="block text-xs font-bold text-slate-600">Description <span className="font-normal text-slate-400">(optional)</span><input name="description" maxLength="100" placeholder="What brings your group together?" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal outline-none focus:border-brand" /></label>
          <label className="block text-xs font-bold text-slate-600">Who can join?
            <select name="privacy" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-normal outline-none focus:border-brand"><option value="private">Private · invite or approval required</option><option value="link">Link access · joining is not connected yet</option></select>
          </label>
          <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setModal(null)} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-500">Cancel</button><button type="submit" disabled={creatingGroup} className="rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-60">{creatingGroup ? 'Saving…' : 'Create group'}</button></div>
        </form>
      </Modal>}

      {modal === 'invite' && <Modal title="Invite a member" description={`Send a mock invite to ${selectedGroup?.name || 'your group'}.`} onClose={() => setModal(null)}>
        <form onSubmit={sendInvite} className="mt-5 space-y-4">
          <label className="block text-xs font-bold text-slate-600">Email address<input type="email" name="email" required placeholder="name@example.com" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal outline-none focus:border-brand" /></label>
          <div className="rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">This mock invite is recorded in Join requests. Email delivery will be added with the backend.</div>
          <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setModal(null)} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-500">Cancel</button><button type="submit" className="rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white">Prepare invite</button></div>
        </form>
      </Modal>}

      {modal === 'join' && <Modal title="Join a group" description="Enter an invite code to request access to a circle." onClose={() => setModal(null)}>
        <form onSubmit={joinByCode} className="mt-5 space-y-4">
          <label className="block text-xs font-bold text-slate-600">Invite code<input name="code" required minLength="4" maxLength="20" placeholder="e.g. CIRCLE24" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal uppercase outline-none focus:border-brand" /></label>
          <div className="rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">A group admin may need to approve your request before you can join.</div>
          <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setModal(null)} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-500">Cancel</button><button type="submit" className="rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white">Send join request</button></div>
        </form>
      </Modal>}
    </div>
  )
}
