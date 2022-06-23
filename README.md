# semver from pr label action

This action can be used on pr merged to determine a semver increasement

## Inputs

## `GITHUB_TOKEN`

**Required** The GITHUB_TOKEN is required to access the GitHub API to read pull request details.

## Outputs

## `versionType`

The semantic version type

## Example usage

```yaml
- name: Detect release type
  uses: tyriis/semver-from-pr-label-action@v1.17
  with:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
