import React from 'react';
import { DUPLICATE_CODE_SMELL_HINT_TYPE, SHAREABLE_CODE_HINT_TYPE, RENAMABLE_CUSTOM_BLOCK, DUPLICATE_CONSTANT_HINT_TYPE, BROAD_SCOPE_VAR_HINT_TYPE } from "../../lib/hints/constants";
import ExtractCustomBlockHint from './extract-custom-block';
import RenamableElement from './renamable-element';
import ExtractConstantHint from './extract-constant';
import ReduceVarScopeHint from './reduce-var-scope';
import ExtractParentSprite from './extract-parent-sprite.jsx';

class HintOverlayComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {

        const { broad_scope_var_hints, hints, blocksSharableHints, renamables,extract_const_hints, extract_parent_sprite_hints, options } = this.props.hintState;
        const allHints = hints.concat(blocksSharableHints).concat(renamables).concat(extract_const_hints).concat(broad_scope_var_hints).concat(extract_parent_sprite_hints);
        return allHints&&(
            <div>
                {allHints
                    .filter(h => {
                        const hasStyle = h?!!h.styles:false;
                        return hasStyle;
                    })
                    .map(h => {
                        switch (h.type) {
                            case "duplicate_code":
                                return <ExtractCustomBlockHint key={h.hintId + "_floater"} hint={h} {...this.props} />
                            case "RENAMABLE_CUSTOM_BLOCK":
                                return <RenamableElement key={h.hintId + "_floater"} hint={h} {...this.props}/>
                            case "duplicate_constant":
                                return <ExtractConstantHint key={h.hintId + "_floater"} hint={h} {...this.props}/>
                            case "broad_scope_var":
                                return <ReduceVarScopeHint key={h.hintId + "_floater"} hint={h} {...this.props}/>
                            case "duplicate_sprite":
                                return <ExtractParentSprite key={h.hintId + "_floater"} hint={h} {...this.props}/>
                        }

                    }

                    )
                }
            </div>
        );
    }

};


export default HintOverlayComponent;