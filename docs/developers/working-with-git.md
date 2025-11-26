We use ```main``` and ```development``` as the two main branches.

The ```main``` branch is the branch for stable code that is ready to be delivered to the client.

```development``` branch will be used the most as this is where development is done. Only stable versions will be sent from ```development``` into the ```main``` branch.

We also base our [feature branches](https://www.optimizely.com/optimization-glossary/feature-branch/) from the ```development``` branch.

Git commits and the feature branches follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard.
```
<type>[optional scope]: <description> 
[optional body]
[optional footer(s)]
```

An example of such a commit would be ```fix: Aligned divs to center of page```
OR ```feature/CI-CD setup``` for a feature branch.