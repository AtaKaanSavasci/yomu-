import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultReminder,validReminderTime,reminderDue,nextReminderDate,reminderCalendar,googleReminderUrl} from '../dist/src/reminders.js';
import {freshState,hydrateState} from '../dist/src/model.js';
test('reminders start disabled and a valid local clock time is required',()=>{
 assert.equal(defaultReminder().enabled,false);for(const s of ['00:00','09:05','23:59'])assert.ok(validReminderTime(s));for(const s of ['24:00','9:5','12:60','19:00\n'])assert.equal(validReminderTime(s),false);
 assert.equal(reminderDue(defaultReminder(),new Date(2026,10,1,20,0)),null);
});
test('a visible-page reminder is due only at the selected minute once per local day',()=>{
 const c={enabled:true,time:'19:30',lastFired:null};assert.equal(reminderDue(c,new Date(2026,10,1,19,29)),null);assert.equal(reminderDue(c,new Date(2026,10,1,19,30)),'2026-11-01');assert.equal(reminderDue(c,new Date(2026,10,1,21,0)),null);assert.equal(reminderDue({...c,lastFired:'2026-11-01'},new Date(2026,10,1,19,30)),null);assert.equal(reminderDue({...c,lastFired:'2026-11-01'},new Date(2026,10,2,19,30)),'2026-11-02');
});
test('calendar export has a daily local-time event and an event-time alarm without line injection',()=>{
 const now=new Date(2026,10,1,19,0);assert.equal(nextReminderDate('19:30',now).getDate(),1);assert.equal(nextReminderDate('18:30',now).getDate(),2);
 const ics=reminderCalendar({time:'19:30',now,url:'https://yomu.invalid/#today',uid:'test',title:'Japonca\nBEGIN:VEVENT; öğren, okuyalım'});
 assert.match(ics,/DTSTART:20261101T193000\r\n/);assert.match(ics,/RRULE:FREQ=DAILY/);assert.match(ics,/TRIGGER:PT0S/);assert.equal(ics.match(/(?:^|\r\n)BEGIN:VEVENT/g).length,1);assert.match(ics,/\\nBEGIN:VEVENT\\;/);assert.ok(ics.split('\r\n').every(line=>new TextEncoder().encode(line).length<=75));
 assert.throws(()=>reminderCalendar({time:'25:00',url:'https://yomu.invalid'}));
});
test('Google Calendar opens an unsaved daily draft and migration does not enable old users notifications',()=>{
 const url=new URL(googleReminderUrl({time:'08:45',url:'https://yomu.invalid/#today',now:new Date(2026,10,1,7)}));assert.equal(url.origin,'https://calendar.google.com');assert.equal(url.searchParams.get('action'),'TEMPLATE');assert.equal(url.searchParams.get('recur'),'RRULE:FREQ=DAILY');assert.ok(url.searchParams.get('ctz'));assert.equal(url.searchParams.get('dates').split('/')[0],'20261101T084500');
 const saved=freshState();delete saved.reminder;delete saved.settings.questionReadings;const hydrated=hydrateState(saved);assert.deepEqual(hydrated.reminder,defaultReminder());assert.equal(hydrated.settings.questionReadings,false);assert.deepEqual(hydrated.events,saved.events);
});
