(() => {
  "use strict";
  const page = document.body.dataset.page;
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const toast = document.getElementById("toast");
  let toastTimeout;
  function notify(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("on");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove("on"), 2700);
  }
  function petals(target, amount = 9) {
    if (reducedMotion || !target) return;
    const rect = target.getBoundingClientRect();
    for (let i = 0; i < amount; i++) {
      const el = document.createElement("span");
      el.className = "petal";
      el.textContent = i % 4 === 0 ? "✿" : "♡";
      el.style.left = rect.left + rect.width * (.2 + Math.random() * .6) + "px";
      el.style.top = rect.top + rect.height / 2 + "px";
      el.style.setProperty("--dx", (Math.random() * 190 - 95) + "px");
      el.style.setProperty("--dy", -(55 + Math.random() * 110) + "px");
      el.style.setProperty("--dr", (Math.random() * 90 - 45) + "deg");
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1200);
    }
  }
  document.querySelectorAll("a[data-page-link]").forEach(link => {
    link.addEventListener("click", event => {
      if (reducedMotion || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || link.target) return;
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      event.preventDefault();
      document.body.classList.add("leaving");
      setTimeout(() => { window.location.assign(href); }, 240);
    });
  });

  // Kate's pocket universe: opening star secrets.
  if (page === "index") {
    const phrases = [
      "You're not hard to love. You're someone worth getting to know properly.",
      "There is no second Kate. That's a pretty big deal, actually.",
      "You don't have to earn your place in anyone's life by giving up your peace.",
      "Somewhere out there are days you'll be so glad you stayed true to yourself."
    ];
    const bubble = document.getElementById("star-prompt");
    const stars = Array.from(document.querySelectorAll("[data-star]"));
    let last = -1;
    function revealStar(i, target) {
      bubble.textContent = phrases[i];
      stars.forEach((star, n) => star.setAttribute("aria-pressed", String(n === i)));
      last = i;
      petals(target, 8);
    }
    stars.forEach((star, i) => star.addEventListener("click", () => revealStar(i, star)));
    document.getElementById("star-surprise").addEventListener("click", event => {
      const i = (last + 1 + Math.floor(Math.random() * (phrases.length - 1))) % phrases.length;
      revealStar(i, event.currentTarget);
    });
  }

  // A proper message dispenser: 36 notes, mode switching, cycling and locally saved favorites.
  if (page === "pocket") {
    const channels = {
      hype: [
        "Kate, you are a whole lot of wonderful in one person. Don't let anyone convince you otherwise.",
        "You are not the bare minimum kind of girl. Never settle for bare minimum kind of effort.",
        "Just a reminder that you're the whole package. Yes, the entire package. With a bow on top.",
        "Being yourself is already a pretty excellent contribution to this planet.",
        "You have the kind of personality people remember for the right reasons.",
        "Your presence is a gift. Not a favor someone gets to demand.",
        "You're allowed to walk into a room knowing you belong there.",
        "You deserve someone who thinks making you smile is a privilege, not a chore.",
        "Someone else's uncertainty about you doesn't need to become your own.",
        "You make the world a more interesting place by being exactly who you are.",
        "I'm officially raising your standards of what you think you deserve. You're welcome.",
        "There is literally only one Kate. You don't have competition."
      ],
      soft: [
        "You can take today one tiny piece at a time. You don't need to fix everything right now.",
        "Your feelings are allowed to be complicated. That doesn't make them wrong.",
        "You do not have to be cheerful to be worth loving.",
        "Rest is not falling behind. It's a way of taking care of someone who matters: you.",
        "Being confused doesn't make you foolish. It means you're trying to understand something difficult.",
        "You can miss someone and still need distance from them. Both can be true.",
        "You've already gotten through days you didn't think you could. Give yourself credit.",
        "You don't need the perfect words to ask someone to listen.",
        "You are still worthy on the days you feel sensitive, anxious, or unsure.",
        "There is no deadline for feeling better. Be patient with your heart.",
        "You can change your mind when you learn more about what you need.",
        "I'm proud of how hard you're trying, even when the effort isn't visible."
      ],
      standards: [
        "Love is not supposed to feel like you're auditioning for it.",
        "Your no is a complete answer. The right person respects it.",
        "Someone who cares about you won't ask you to prove love by crossing your boundaries.",
        "Trust grows where questions can be asked without punishment.",
        "A relationship should make room for your life, not swallow it whole.",
        "You can care about someone deeply and still decide something isn't right for you.",
        "A thoughtful date, respect, and honesty are not impossible standards.",
        "The way someone handles your feelings matters just as much as what they say.",
        "You deserve consistency, not a guessing game.",
        "Your values are not a bargaining chip. They deserve respect.",
        "You are allowed to choose peace even without anyone else's permission.",
        "There are people capable of patient, kind and genuine love. You don't have to accept less."
      ]
    };
    const categoryNames = {hype:"TODAY'S COMPLIMENT",soft:"A SOFTER LITTLE NOTE",standards:"REMEMBER YOUR STANDARDS"};
    const buttons = Array.from(document.querySelectorAll("[data-pocket-mode]"));
    const textNode = document.getElementById("slip-message");
    const labelNode = document.getElementById("slip-category");
    const countNode = document.getElementById("slip-count");
    const slip = document.getElementById("message-slip");
    const save = document.getElementById("save-slip");
    const totalNode = document.getElementById("pocket-total");
    const list = document.getElementById("saved-list");
    const empty = document.getElementById("saved-empty");
    const panel = document.getElementById("saved-panel");
    const openButton = document.getElementById("open-pocket");
    const KEY = "kate-universe-favorites-v1";
    let mode = "hype";
    let position = {hype:0,soft:0,standards:0};
    let saved = [];
    try {
      const val = JSON.parse(window.localStorage.getItem(KEY)||"[]");
      if (Array.isArray(val)) saved = val.filter(x => typeof x === "string" && /^(hype|soft|standards):(?:[0-9]|1[01])$/.test(x)).slice(0,36);
    } catch (_) { saved = []; }
    const idFor = (m, i) => m + ":" + i;
    function store() { try {window.localStorage.setItem(KEY, JSON.stringify(saved));} catch (_) { /* private mode still works for this visit */ } }
    function renderSaved() {
      totalNode.textContent = saved.length + (saved.length===1?" note kept":" notes kept");
      list.replaceChildren();
      empty.hidden = saved.length > 0;
      saved.forEach(id => {
        const [m,n] = id.split(":");
        const li = document.createElement("li");
        li.textContent = channels[m][Number(n)];
        list.appendChild(li);
      });
    }
    function render(animate) {
      textNode.textContent = channels[mode][position[mode]];
      labelNode.textContent = categoryNames[mode];
      countNode.textContent = String(position[mode]+1).padStart(2,"0")+" / 12";
      buttons.forEach(b => {
        const on = b.dataset.pocketMode===mode;
        b.classList.toggle("active",on);
        b.setAttribute("aria-pressed",String(on));
      });
      const on = saved.includes(idFor(mode,position[mode]));
      save.setAttribute("aria-pressed",String(on));
      save.textContent = on?"♥ saved in my pocket":"♡ save to my pocket";
      if(animate) { slip.classList.remove("printing"); void slip.offsetWidth; slip.classList.add("printing"); }
    }
    buttons.forEach(btn=>btn.addEventListener("click",()=>{
      mode=btn.dataset.pocketMode;render(true);petals(btn,5);
    }));
    function turn(amount) {position[mode]=(position[mode]+amount+12)%12;render(true);}
    document.getElementById("next-slip").addEventListener("click",e=>{turn(1);petals(e.currentTarget,5);});
    document.getElementById("prev-slip").addEventListener("click",()=>turn(-1));
    document.getElementById("random-slip").addEventListener("click",()=>{
      const original = mode+":"+position[mode];
      const options = Object.keys(channels).flatMap(m=>channels[m].map((_,i)=>m+":"+i)).filter(x=>x!==original);
      const [newMode,i] = options[Math.floor(Math.random()*options.length)].split(":");
      mode=newMode;position[mode]=Number(i);render(true);
    });
    save.addEventListener("click",()=>{
      const id=idFor(mode,position[mode]);
      if(saved.includes(id)){saved=saved.filter(x=>x!==id);}
      else saved.push(id);
      store();render(false);renderSaved();petals(save,8);
    });
    openButton.addEventListener("click",()=>{
      panel.hidden=!panel.hidden;
      openButton.setAttribute("aria-expanded",String(!panel.hidden));
      openButton.textContent=panel.hidden?"open my pocket ↗":"close my pocket ↑";
    });
    document.getElementById("clear-pocket").addEventListener("click",()=>{
      saved=[];store();render(false);renderSaved();notify("your little pocket is clear ♡");
    });
    document.getElementById("copy-slip").addEventListener("click",async()=>{
      const value=textNode.textContent;
      try {
        if(navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(value);
        else {
          const temp=document.createElement("textarea"); temp.value=value;temp.style.position="fixed";temp.style.opacity="0";
          document.body.appendChild(temp);temp.select();const ok=document.execCommand("copy");temp.remove();if(!ok)throw Error("copy unavailable");
        }
        notify("copied to keep close ♡");
      }catch(_){notify("try selecting the note to copy it instead");}
    });
    render(false);renderSaved();
  }

  // Grow one flower at a time; tap planted flowers to revisit their messages.
  if (page === "garden") {
    const lines = {
      peace: "Your peace isn't a prize someone gets to take away. It is worth protecting.",
      joy: "You are allowed to laugh, go out, be silly and enjoy your life. Happiness belongs to you.",
      trust: "You deserve relationships where honesty isn't a treasure hunt.",
      respect: "Your comfort, your voice, and your boundaries matter every single time.",
      hope: "You have not met every person who will appreciate you, or lived every happy day ahead.",
      you: "This last one is for the girl who has been holding everything together. You deserve care, too."
    };
    const nodes=Array.from(document.querySelectorAll("[data-seed]"));
    const grown=new Set();
    const label=document.getElementById("garden-topic");
    const text=document.getElementById("garden-text");
    const counter=document.getElementById("garden-count");
    const finish=document.getElementById("garden-finish");
    function render() {
      counter.textContent=grown.size+" of "+nodes.length;
      finish.hidden=grown.size!==nodes.length;
      nodes.forEach(n=>n.setAttribute("aria-pressed",String(grown.has(n.dataset.seed))));
    }
    nodes.forEach(node=>node.addEventListener("click",()=>{
      const key=node.dataset.seed;
      const fresh=!grown.has(key);
      grown.add(key);
      label.textContent=key==="you"?"a note about you":key+", always";
      text.textContent=lines[key];
      render();if(fresh)petals(node,8);
    }));
    document.getElementById("garden-reset").addEventListener("click",()=>{
      grown.clear();label.textContent="a little note from bella";
      text.textContent="You don't need to bloom all at once. Take your time. I'm rooting for you, always.";
      render();
    });
    render();
  }

  // A tiny postcard carousel with true flip state, arrows and accessible jump buttons.
  if (page === "future") {
    const cards=[
      ["a quiet sunday morning","One day I hope you wake up without needing to untangle your feelings about how someone treated you. Just a peaceful morning. Coffee, music, sunlight, and being comfortable in your own company. You deserve that peace."],
      ["the spontaneous road trip","A playlist you love, someone laughing beside you, and a drive with no pressure to be anything but yourself. There are still memories out there with your name on them."],
      ["the friend who shows up","On the days when everything feels upside down, you'll remember that being cared for doesn't have to be complicated. You have people who want to sit with you through it. I do."],
      ["the love that respects you","If you choose a relationship again, I hope it comes with patience, honesty, and someone who never treats your boundaries like a challenge. That kind of respect is possible."],
      ["the things you haven't tried","New places, unexpected hobbies, accomplishments you're not even dreaming about yet. You don't have to figure out the entire future today to have one worth getting excited about."],
      ["a note from future you","I hope future Kate looks back at this season and thanks present Kate for being gentle with herself, listening to her instincts, and believing she was always worthy of kindness."]
    ];
    const card=document.getElementById("future-card");
    const title=document.getElementById("future-title");
    const note=document.getElementById("future-message");
    const count=document.getElementById("future-count");
    const dots=document.getElementById("future-dots");
    let index=0;
    let buttons=[];
    function render(){
      title.textContent=cards[index][0];
      note.textContent=cards[index][1];
      count.textContent=String(index+1).padStart(2,"0")+" / "+String(cards.length).padStart(2,"0");
      card.classList.remove("flipped");card.setAttribute("aria-pressed","false");
      buttons.forEach((b,i)=>b.setAttribute("aria-pressed",String(i===index)));
    }
    function move(i){index=(i+cards.length)%cards.length;render();}
    cards.forEach((_,i)=>{
      const button=document.createElement("button");button.type="button";
      button.className="future-dot";button.setAttribute("aria-label","Show postcard "+(i+1));
      button.addEventListener("click",()=>move(i));dots.appendChild(button);buttons.push(button);
    });
    card.addEventListener("click",()=>{
      const flipped=card.classList.toggle("flipped");
      card.setAttribute("aria-pressed",String(flipped));
      if(flipped)petals(card,5);
    });
    document.getElementById("future-prev").addEventListener("click",()=>move(index-1));
    document.getElementById("future-next").addEventListener("click",()=>move(index+1));
    document.addEventListener("keydown",e=>{
      const active=document.activeElement;
      if (active!==card && !active?.classList?.contains("postcard-nav")) return;
      if(e.key==="ArrowLeft"){e.preventDefault();move(index-1);}
      if(e.key==="ArrowRight"){e.preventDefault();move(index+1);}
    });
    render();
  }

  if (page === "mirror") {
    const cards = document.querySelectorAll(".reveal-card");
    const count = document.getElementById("card-count");
    const everSeen = new Set();
    cards.forEach((card, i) => {
      card.addEventListener("click", () => {
        const on = card.getAttribute("aria-pressed") !== "true";
        card.setAttribute("aria-pressed", String(on));
        card.setAttribute("aria-label", on ? "Hide reminder " + (i + 1) : "Reveal reminder " + (i + 1));
        if (on) { everSeen.add(i); petals(card, 5); }
        count.textContent = everSeen.size + " out of " + cards.length + " reminders found" + (everSeen.size === cards.length ? " · all six are true, by the way ♡" : "");
      });
    });
  }
  if (page === "choose") {
    const drafts = {
      space: {
        title: "a little breathing room",
        text: "I've been feeling overwhelmed, and I need some time and space to think about what I want and what feels right for me. Please respect that I need a little distance right now. I'll reach out when I'm ready to talk."
      },
      boundary: {
        title: "my boundaries matter",
        text: "I care about you, but I need to be clear about something important to me. My boundaries are not up for negotiation. I need a relationship where my choices and my 'no' are respected without pressure or guilt. Please don't ask me to prove my love by crossing my boundaries. If we can't agree on that, I need to reconsider this relationship."
      },
      end: {
        title: "choosing to move forward",
        text: "I've thought a lot about us, and I've realized this relationship isn't giving me the trust, respect, and peace I need. I care about what we've shared, but I'm choosing to end our relationship. This decision isn't easy, and it's final. I need you to respect it and give me space. I wish you well."
      },
      friend: {
        title: "a note to bella",
        text: "hey bella, can we talk? i'm feeling really confused and could use someone in my corner right now. i don't need you to solve anything, i just need my friend. ♡"
      }
    };
    const buttons = document.querySelectorAll("[data-draft]");
    const label = document.getElementById("draft-label");
    const content = document.getElementById("draft-text");
    const copy = document.getElementById("copy-draft");
    buttons.forEach(button => {
      button.addEventListener("click", () => {
        buttons.forEach(b => b.setAttribute("aria-pressed", String(b === button)));
        const draft = drafts[button.dataset.draft];
        label.textContent = draft.title;
        content.textContent = draft.text;
        petals(button, 4);
      });
    });
    copy.addEventListener("click", async () => {
      const text = content.textContent;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          const t = document.createElement("textarea");
          t.value = text;
          t.setAttribute("readonly", "");
          t.style.position = "fixed";
          t.style.opacity = "0";
          document.body.appendChild(t);
          t.select();
          const copied = document.execCommand("copy");
          t.remove();
          if (!copied) throw new Error("Clipboard unavailable");
        }
        notify("copied. take your time, kate ♡");
        petals(copy, 9);
      } catch (err) {
        notify("copy didn't work. press and hold the message to select it.");
        content.focus();
      }
    });
    const secret = document.getElementById("final-secret");
    const line = document.getElementById("secret-line");
    secret.addEventListener("click", () => {
      line.hidden = !line.hidden;
      const open = !line.hidden;
      secret.setAttribute("aria-expanded", String(open));
      secret.textContent = open ? "tuck your note away ↑" : "open your last little note ♡";
      if (open) petals(secret, 17);
    });
  }
})();