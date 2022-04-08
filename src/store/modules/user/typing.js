export let Action;

(function (Action) {
  Action['ADD'] = 'add';
  Action['DELETE'] = 'delete';
  Action['UPDATE'] = 'update';
  Action['QUERY'] = 'query';
  Action['IMPORT'] = 'import';
  Action['EXPORT'] = 'export';
})(Action || (Action = {}));
