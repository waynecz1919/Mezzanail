"use client";

import { ChevronDown, Globe2, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/components/providers";
import { Locale } from "@/lib/i18n";
import { useState } from "react";

export function LanguageMenuPlaceholder(){
  const {locale,setLocale,localeNames}=useLanguage();const [open,setOpen]=useState(false);
  return <div className="relative"><button className="flex h-10 items-center gap-2 rounded-xl border border-[var(--line)] px-3 text-xs font-bold" onClick={()=>setOpen(!open)}><Globe2 size={15}/>{localeNames[locale]}<ChevronDown size={12}/></button>{open&&<div className="card absolute right-0 top-12 z-20 min-w-32 p-1.5">{(Object.keys(localeNames) as Locale[]).map(item=><button key={item} className="block w-full rounded-lg px-3 py-2 text-left text-xs font-bold hover:bg-[var(--surface)]" onClick={()=>{setLocale(item);setOpen(false)}}>{item==="en"?"English":item==="zh"?"简体中文":"Bahasa Melayu"}</button>)}</div>}</div>
}
export function ThemeTogglePlaceholder(){const {resolvedTheme,setTheme}=useTheme();return <button className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--line)]" onClick={()=>setTheme(resolvedTheme==="dark"?"light":"dark")} aria-label="Toggle colour mode">{resolvedTheme==="dark"?<Sun size={16}/>:<Moon size={16}/>}</button>}

