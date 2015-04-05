 .service('es', ['esFactory', function (esFactory) {
        return esFactory({
            hosts: [
                'localhost:9200'
            ],
            log: 'trace'
        });
    }])
    .factory('searchService', ['es', function (es) {
        return {
            'fullTextSearch': function (from, size, text) {
                return es.search({
                    index: 'abc',
                    type: 'rfp',
                    body: {
    'from': from,
    'size': size,
    'query': {
        'bool': {
            'must': [
                {
                    'fuzzy_like_this': {
                        'fields': [
                            'content',
                            'tags'
                        ],
                        'like_text': 'search rfp',
                        'min_similarity': 0.7,
                        'prefix_length': 1
                    }
                }
            ]
        }
    },
    'facets': {
        'artist_type': {
            'terms': {
                'field': 'author'
            }
        }
    }
    
}
                });
            },

            'autocomplete': function (text) {
                return es.search({
                    index: 'abc',
                    type: 'rfp',
                    body: {
                        'fields': [
                            'author',
                            'content'
                           
                        ],
                        'query': {
                            'query_string': {
                                'fields': [
                                    'author.start',
                                    'content',
                                    'tags'
                                   
                                ],
                                'query': text,
                                'use_dis_max': false,
                                'auto_generate_phrase_queries': true,
                                'default_operator': 'OR'
                            }
                        },
                        'highlight': {
                            'number_of_fragments': 0,
                            'pre_tags': [
                                '<b>'
                            ],
                            'post_tags': [
                                '</b>'
                            ],
                            'fields': {
                                'author.start': {},
                                'content': {},
                                'tags.string': {}
                            }
                        }
                    }
                });
            },'index': function (rfp) {
                return es.create({
  index: 'searchtest',
  type: 'rfp',
  body: {
    file: rfp.file,
    filename:rfp.filename,
    filedate:rfp.filedate,
    author:rfp.author,
    couple:rfp.couple,
    tags:rfp.tags
  }});
}
        };
    }])