---
title: "CSS_STYLE_README"
author: "Alex Bistagne"
date: "October 15, 2019"
output: html_document
---
Rather than just pull a concept of good design out of nowhere, I am going to pull the rules for our app design from the rules for good Flag design:

### The Five Principles of Flag Design:
1. Keep it Simple
2. Use Meaningful Symbolism
3. USe 2 or 3 Basic Colors
4. No lettering or Seals
5. Be Distinctive or Be related.

Because we are an app that inherently needs words, and not a flag in the wind, I am going to interpret the "no lettering or seals" as be legible and comprehendable, or in simple words: be Careful with Lettering or Seals.

#Style Guideline:
## Keep it simple
### Limit lineart to the following shapes:
 1. Circular arcs 
 2. Rectangles 
 3. Archemedies Spirals 
 4. Straight Lines
 Implied by this is the fact that we need beveled edges on all of our input boxes, but not uselessly within the grid.
 
### <=5 Fields per Object
Try to keep the number of fields in an input box to fewer than 5. Too many and a design will look cluttered.

### <=5 Click/Drags per Object
Try to keep the number of click/drag effects to be fewer than 5 on each conceptual object. If you have more than 5 fields that could be hidden behind a useful dropdown menu. 5 is a soft boundary.

### Layers >> Large Objects
Create layers of meaning instead of dumping everything onto one page. Use Objects within Objects instead of overly complex objects.

## Use Meaningful Symbolism
Our 4 symbolic inspirations are:
Chosen to be memorable but not unique.

###Paper
Because Calendars are made of paper

###Thumbtacks 
Because people hold Calendars to walls with it.

###Spirals
Because people get frustrated with logistics. Also I like doing art with spirals and am a fan of the Raymond Pettibon painting with spirals.

###Slugs 
Because we need a good character to explain errors and we are a UCSC project. I am not going to claim implementing him is a high priority, but anyway.

## Use 2 or 3 Basic Colors
### Blue and Green, Yellow
Blue and Green are our base colours with Yellow for errors.
 Here are the specific HEX CODES:
      Blue:#AAE0FA
      Green: #9BD3AE
      Gold: <Yet to be chosen>
 Start with these hex codes then add shading/gradients/textures as needed.
 
### limit our Accent and Black / White shades
here are the Hex codes 
For text Fields: <Yet to be chosen>
For Text: Black <yet to be chosen>
For Some Borders: Cyan <yet to be chosen>
For Other Borders: Dark Blue #455B66
For Error code borders: Dark yellow <Yet to Be Chosen

### Always Use Black Text when on white, Blue, and Green
For small text regular Black is best for contrast.
For larger text feel free to use the dark blue above

### Always use white Text with a Black outline on Yellow
Yellow is a color we want to avoid putting as a background
as it doesn't read well. However, Black text with a white 
outline can be read on anything so use that if you must 
put text on yellow.

## Be Careful with lettering or Seals
### DO NOT USE OFFICIAL UCSC imagery
  We don't know what legal relation we have to UCSC, and implying that we are an official entity is a bad plan.
  
### Use Icons of the places when providing links off site
  When linking facebook or similar apps, we want to use as familiar a symbol as possible. Please don't confuse someone by changing the coloring on their app.
  
### Use Consistent Fonts:
  Dangerous Errors in Comic Sans
  Written Text in Helvetica Now
  Numbers and short important things in Impact.
  
### Have rules for Bold, Italics etc
  Use bold sparringly. I'd prefer impact over Helvetic Now bold.
  Use Strikethrough sparingly it looks unprofessional.
  Use Italics for keywords if neccessary.
  I'd like to have a discussion before we use other font variations.
  
## Be Distinctive or Be Related
### Have Features Be Discoverable
  Discoverable is a technical design term:
  In plainer english, it means have you features be hinted at or signalled by the imagery and conceptual implications of your object. Don't have an interface which is a significantly inaccurate representation of the underlying system.
  
### Don't reuse assets in conflicting ways
  Symbols should have a consistent and easy to understand meaning within the context of our application. Don't use the '+' symbol for things that aren't best described as 'adding' such as editing a post.
  
### Have Symbols be familiar
  Don't invent new symbols. The point of language for most humans is to create shared meaning between you and the particiant. Good Design is not merely aesthetically pleasing, but also comprehendable.
  
### Have Fun Symbols
  I don't have a good explanation for this one. Other than that our application should stay within an aesthetic of upbeat positivity. We can have our joking negativity within friends on the team, but let's not make an edgy app. That sounds like a bad plan. Use neutral or well recieved imagery. 