echo "Pushing to github pages branch..."
git subtree split --prefix dist -b gh-pages
git push -f origin gh-pages:gh-pages
echo "Done."