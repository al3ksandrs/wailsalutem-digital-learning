# Wiki Guidelines

For the wiki we use MkDocs. MkDocs is a static site generator that uses markdown files as the source.

### Expanding the wiki

To add a new page, simply add a new `.md` file under `/documentation` or `/developers`.
The new page should follow kebab-case naming.

An example page would look like this: `/documentation/test.md`

To actually add the page to the wiki you need to add it in the `mkdocs.yml` file. If we want to add our new `test.md` page for example;

```yaml
theme:
  name: material

site_name: WailSalutem Digital Learning wiki

nav:
  - Home: index.md
  - Documentation:
    - Cooperation agreement: documentation/cooperation-agreement.md
    - UML's:
      - Class Diagram: documentation/uml-diagram.md
      - Use Case Diagram: documentation/use-case-diagram.md
      - Test: documentation/test.md
```

### Testing

To actually see the new page with the content we put in it, we need to run `npm run wiki` on the monorepo root level.
This will start a local server; `http://127.0.0.1:8000/`. Navigating to this link will allow you to view the static site generated locally.

### Deploying the wiki

To deploy the wiki to the internet, just run `npm run wiki:deploy` on the monorepo root level.
Make sure to only do this from the `development` branch!