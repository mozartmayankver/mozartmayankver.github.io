# Yug Turns ONE! — Birthday Invitation

A mobile-first, static invitation for Yug’s first birthday. It uses plain HTML, CSS, and JavaScript and can be hosted from the root of a GitHub Pages repository.

## Add Yug’s photograph

Yug’s supplied portrait is included at `yug-photo.png`. If you replace it later, keep that filename or update the image reference in `index.html`. The image is framed at portrait proportions and cropped with `object-fit: cover`; adjust `object-position: 50% 40%` on `.portrait img` in `styles.css` to change which part of the photo is visible. Replace the placeholder social preview at `yug-invitation-preview.jpg` with a suitable invitation image before publishing if you want a social card image. Set an absolute public URL in the Open Graph image metadata when the published URL is known; social platforms may cache previews.

## Create and push the GitHub repository

Create a GitHub repository named `yug-first-birthday`. Open a terminal in this project folder, then run these commands for a new local Git repository:

```sh
git init
git add .
git commit -m "Create Yug's birthday invitation"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/yug-first-birthday.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username. If you already have a Git repository, check its current state and remote first; do not reinitialize it or replace an existing remote unnecessarily. To upload without Git, use GitHub’s web interface to add the project files while preserving the directory structure.

## Enable GitHub Pages

1. Open the `yug-first-birthday` repository on GitHub.
2. Open **Settings**, then **Pages**.
3. Under the build and deployment source, choose **Deploy from a branch**.
4. Select the `main` branch and the root (`/`) folder, then save.
5. Wait for GitHub Pages to finish publishing.
6. Open `https://YOUR_USERNAME.github.io/yug-first-birthday/` and test the invitation on a phone.

This folder is designed to be the repository root, so `index.html`, `styles.css`, `script.js`, `yug-photo.png`, and `favicon.svg` stay together at the top level when uploaded.

## Final checks and future updates

- Confirm `yug-photo.png` loads and adjust its crop if needed.
- Confirm the countdown is counting to 26 October 2026 at 7:30 PM IST.
- Open both venue buttons and confirm they go to the supplied Google Maps location.
- Open the invitation, check keyboard focus, and test reduced motion in your device settings.
- Try **Share This Invitation** in a supported mobile browser; otherwise it copies the page link.
- Check the layout on a narrow phone and desktop. Social preview metadata should use an absolute published image URL.

For later edits, update the files, then run `git add .`, `git commit -m "Describe the update"`, and `git push`. GitHub Pages republishes the changes.

## Event details

- **Date:** Monday, 26 October 2026
- **Time:** 7:30 PM onwards, IST (UTC+05:30)
- **Venue:** SOVANA by Trees and Treats
- **Map:** https://maps.app.goo.gl/p2NmHYaDJmxmdck79
